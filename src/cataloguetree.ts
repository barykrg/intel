import * as vscode from 'vscode';
import {XMLHttpRequest} from 'xmlhttprequest';
import * as path from 'path';
import * as fs from 'fs';
export class DepNodeProvider implements vscode.TreeDataProvider<Dependency> {
	private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined | void> = new vscode.EventEmitter<Dependency | undefined | void>();
	//readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | void> = this._onDidChangeTreeData.event;
	constructor() {
		console.log('Tree Made');
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: Dependency): vscode.TreeItem {
		return element;
	}

	getChildren(element?: Dependency): vscode.ProviderResult<Dependency[]>{
		
		const images:Dependency[]=[];
		images.push(new Dependency("Refrerence Implementation","",[],[],[],"","","","","","","","","","","","",[],true,"RI", this.getRecipe()));
		return element===undefined?images:element.children;
	}
	
	public  getRecipe()
	{
		const recipe = [];
		for( const i of this.getData())
		{
			//console.log(i.osIds);
			if(!i.isSDK)
			{
				recipe.push(new Dependency(i.label+":"+i.version,i.version,i.ingredients,i.installationIngOrder,i.displayIngOrder,i.id
				,i.modifiedOn,i.name.en,i.displayName.en,i.recipeType,i.label,i.desc.en,i.defaultOs,i.defaultHw,i.defaultAcc,i.uiRoute,i.ircProductId,i.osIds,i.isSDK,"Recipe"));
			}
		}
		return recipe;
	}
	public getData()
	{
		const url = `http://localhost:8080/recipe`; //A local page

		const xhttp = new XMLHttpRequest();
		xhttp.open("GET", url,false);
		xhttp.send();
		return JSON.parse(xhttp.responseText);
	}
	public pull(item:Dependency)
	{
		console.log(`http://localhost:8080/recipe/upgrade/${item.id}?order=installation`);
		console.log(`http://localhost:8080/recipe/getAllByIrcId/${item.id}?osId=${item.osIds[0]}`);
		const url = `http://localhost:8080/recipe/upgrade/${item.id}?order=installation`; //A local page

		const xhttp = new XMLHttpRequest();
		xhttp.open("GET", url, false);
		xhttp.send(null);
		console.log(xhttp.responseText);
		
		const filename = `${item.label}`.replace(' ','').replace('.',"_").replace(':',"@");
		const baseDir = path.join("/", 'tmp',filename);
		if(!fs.existsSync(baseDir))
		{
			fs.mkdirSync(baseDir);
		}
		fs.writeFile(path.join(baseDir,'edgesoftware_configuration.xml'), xhttp.responseText, function (err) {
			if (err)
			{
				vscode.window.showErrorMessage(`${item.label} pull failed`);
				return;
			}
			vscode.window.showInformationMessage(`${item.label} pull successful`);
		});

	}

}

export class Dependency extends vscode.TreeItem {
	children : Dependency[]|undefined;
	constructor(
		public readonly label: string,
		public readonly version: string,
		public readonly ingredients: string[],
		public readonly installationIngOrder: string[],
		public readonly displayIngOrder: string[],
		public readonly id: string,
		public readonly modifiedOn: string,
		// //name in english language
		public readonly name: string,
		public readonly displayName: string,
		public readonly labelAPI:string,
		public readonly recipeType: string,
		// //description in english language
		public readonly desc: string,
		public readonly defaultOs: string,
		public readonly defaultHw: string,
		public readonly defaultAcc: string,
		public readonly uiRoute: string,
		public readonly ircProductId: string,
		public readonly osIds: string[],
		// //isSDK
		public readonly isSDK: boolean,
		
		public readonly contextValue:string,
		children?:Dependency[]
	) {
		super(label,
			children===undefined ? vscode.TreeItemCollapsibleState.None:vscode.TreeItemCollapsibleState.Collapsed
			);
			this.children = children;

	}
	
}

//Json DATA

// version: (rec.displayVersion || rec.version),
// ingredients: rec.ingredients,
// installationIngOrder: rec.installationIngOrder,
// displayIngOrder: rec.displayIngOrder,
// id: rec.id,
// modifiedOn: rec.modifiedOn,
// //name in english language
// name: rec.name,
// displayName: rec.displayName,
// label:(rec.displayName && rec.displayName.en) ||  rec.name.en,
// recipeType: rec.recipeType,
// //description in english language
// desc: rec.description,
// defaultOs: rec.defaultOs,
// defaultHw: rec.defaultHw,
// defaultAcc: rec.defaultAcc,
// archive: rec.archive,
// uiRoute: rec.uiRoute,
// ircProductId: rec.ircProductId,
// //isSDK
// isSDK: rec.isSDK
