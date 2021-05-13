'use strict';

import * as vscode from 'vscode';
import * as cataloguetree from './cataloguetree';
import * as oscataloguetree from './oscataloguetree';


export function activate(context: vscode.ExtensionContext) {

	//Intel Catalog
	const catalogueImages = new cataloguetree.DepNodeProvider();
	vscode.window.createTreeView('catalog',{treeDataProvider:catalogueImages});
	vscode.commands.registerCommand('intelregistry.pull', (item:cataloguetree.Dependency) => catalogueImages.pull(item));

	//OS Catalogue
	const oscatalogueImages = new oscataloguetree.DepNodeProvider();
	vscode.window.createTreeView('oscatalog',{treeDataProvider:oscatalogueImages});
	vscode.commands.registerCommand('intelregistry.ospull', (item:oscataloguetree.Dependency) => oscatalogueImages.pull(item));
	vscode.commands.registerCommand('intelregistry.refresh', (item:oscataloguetree.Dependency) => oscatalogueImages.refresh());
}