// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { NoteWorkspace } from './NoteWorkspace';



// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// The commandId parameter must match the command field in package.json
	const newNoteDisposable = vscode.commands.registerCommand(
		'daily-notes.newDailyNote',
		NoteWorkspace.newNote
	);

	const newNoteWithTemplateDisposable = vscode.commands.registerCommand(
		'daily-notes.newNoteUsingTemplate',
		NoteWorkspace.newNoteUsingTemplate
	);

	const sortTwoLevelListDisposable = vscode.commands.registerCommand(
		'daily-notes.sortTwoLevelList',
		NoteWorkspace.sortTwoLevelList
	);

	context.subscriptions.push(newNoteDisposable, newNoteWithTemplateDisposable, sortTwoLevelListDisposable);

	vscode.commands.executeCommand('daily-notes.newNoteUsingTemplate');
}



// This method is called when your extension is deactivated
export function deactivate() { }
