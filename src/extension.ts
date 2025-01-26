import * as vscode from 'vscode';
import { NoteWorkspace } from './NoteWorkspace';

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

	const insertDateDisposable = vscode.commands.registerCommand(
		'daily-notes.insertDate',
		NoteWorkspace.insertDate
	);
	const insertTimeDisposable = vscode.commands.registerCommand(
		'daily-notes.insertTime',
		NoteWorkspace.insertTime
	);

	const insertDateTimeDisposable = vscode.commands.registerCommand(
		'daily-notes.insertDateTime',
		NoteWorkspace.insertDateTime
	);

	context.subscriptions.push(
		newNoteDisposable,
		newNoteWithTemplateDisposable,
		sortTwoLevelListDisposable,
		insertDateDisposable,
		insertTimeDisposable,
		insertDateTimeDisposable);

	vscode.commands.executeCommand('daily-notes.newNoteUsingTemplate');
}

export function deactivate() { }
