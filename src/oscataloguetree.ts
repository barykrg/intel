import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
export class DepNodeProvider implements vscode.TreeDataProvider<Dependency> {
  private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined | null | void> = new vscode.EventEmitter<Dependency | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | null | void> = this._onDidChangeTreeData.event;	
  constructor() {
		console.log('OSTree Made');
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: Dependency): vscode.TreeItem {
		return element;
	}

	getChildren(element?: Dependency): vscode.ProviderResult<Dependency[]>{
		
		const images:Dependency[]=[];
		images.push(new Dependency("Refrerence Implementation","RI",this.getRecipe()));
		return element===undefined?images:element.children;
	}
	
	public  getRecipe()
	{
		const recipe = [];
		for( const i of this.getData())
		{
			console.log(i);
			if(fs.existsSync(path.join("/tmp",i,"edgesoftware_configuration.xml")))
			{
				const name = i.replace("@",":");
				recipe.push(new Dependency(name,'OSRecipe'));
			}
		}
		return recipe;
	}
	public getData()
	{
		return fs.readdirSync("/tmp");
	}
	public pull(item:Dependency)
	{
		vscode.window.showInformationMessage(`Pull ${item.label} successfull`);
		const foldername = item.label;
		const pathToXML = path.join("\\","tmp",foldername);
		const command = cp.exec(`cd ${pathToXML} && /home/barun/test/edgesoftware install`);
		command.on('error',(error)=>{console.log("someerror"+error);});
		command.stderr?.on('data',(data)=>{console.log("someerror"+String(data));});
		command.stdout?.on("data", async (data) => {
		vscode.window.showInformationMessage(data);
			
			if (data.includes("Product Key")) {
			const productKey= await vscode.window.showInputBox({prompt:"Product Key"});
			command.stdin?.write(`${productKey}\r\n`);			
		} 
		});
	}

}

export class Dependency extends vscode.TreeItem {
	children : Dependency[]|undefined;
	constructor(
		public readonly label: string,
		public readonly contextValue:string,
		children?:Dependency[]
	) {
		super(label,
			children===undefined ? vscode.TreeItemCollapsibleState.None:vscode.TreeItemCollapsibleState.Collapsed
			);
			this.children = children;

	}
	
}