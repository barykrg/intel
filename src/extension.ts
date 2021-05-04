'use strict';

import * as vscode from 'vscode';
import * as cataloguetree from './cataloguetree';


export function activate(context: vscode.ExtensionContext) {

	const catalogueImages = new cataloguetree.DepNodeProvider();
	vscode.window.createTreeView('catalog',{treeDataProvider:catalogueImages});
	vscode.commands.registerCommand('intelregistry.pull', (item:cataloguetree.Dependency) => catalogueImages.pull(item));
}