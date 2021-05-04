'use strict';

import * as data from './data';
import * as vscode from 'vscode';
import * as cataloguetree from './cataloguetree';


export function activate(context: vscode.ExtensionContext) {

	console.log(context.extensionPath);
	const jsondata = data.clidata;
	console.log(jsondata);
	const catalogueImages = new cataloguetree.DepNodeProvider();
	vscode.window.createTreeView('catalog',{treeDataProvider:catalogueImages});
	vscode.commands.registerCommand('intelregistry.pull', (item:cataloguetree.Dependency) => catalogueImages.pull(item));
}