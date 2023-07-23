//nuke
// import * as vscode from "vscode";
// // import { MorphLanguageClient, RunChatParams } from "../client";
// // import * as client from '../client'

// import { getNonce } from "../getNonce";
// import { logProvider } from "../extension";
// import PubSub from "../lib/PubSub";
// import type {
//   AgentRegistryItem,
//   MorphLanguageClient,
//   RunAgentParams,
// } from "../client";
// import { chatProvider } from "../extension";
// import { WebviewState } from "../types";

// export class LogProvider implements vscode.WebviewViewProvider {
//   _view?: vscode.WebviewView;
//   _doc?: vscode.TextDocument;

//   // In the constructor, we store the URI of the extension
//   constructor(
//     private readonly _extensionUri: vscode.Uri,
//     public morph_language_client: MorphLanguageClient
//   ) {}

//   // Posts a message to the webview view.
//   //  endpoint: The endpoint to send the message to.
//   //  message: The message to send.
//   //  Throws an error if the view is not available.
  
//   private postMessage(endpoint: string, message: any) {
//     if (!this._view) {
//       throw new Error("No view available");
//     } else {
//       this._view.webview.postMessage({ type: endpoint, data: message });
//     }
//   }

//   public stateUpdate(state: WebviewState) {
//     this.postMessage('stateUpdate', state)
//   }
  

//   public resolveWebviewView(
//     webviewView: vscode.WebviewView,
//     context: vscode.WebviewViewResolveContext,
//     _token: vscode.CancellationToken
//   ) {
//     this._view = webviewView;
//     webviewView.webview.options = {
//       enableScripts: true,
//       localResourceRoots: [this._extensionUri],
//     };
//     webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

//     // from webview    
//     webviewView.webview.onDidReceiveMessage(async (data) => {
//       if (!this._view) throw new Error("no view");
//       console.log("LogProvider.ts recieved:");
//       console.log(data);
//       switch (data.type) {
//         case "selectedAgentId":
//           this.morph_language_client.sendSelectedAgentChange(data.agentId)
//           break;
//         case "copyText":
//           console.log("recieved copy in webview");
//           vscode.env.clipboard.writeText(data.content);
//           vscode.window.showInformationMessage("Text copied to clipboard!");
//           break;
//         case "cancelAgent": {
//           this.morph_language_client.cancel({ id: data.id });
//         }
//         case "delete": {
//           //TODO
//           this.morph_language_client.cancel({ id: data.id });
//         }
//         default:
//           console.log("no case match for ", data.type, " in LogProvider.ts");
//       }
//     });
//   }

//   public revive(panel: vscode.WebviewView) {
//     this._view = panel;
//   }

//   private _getHtmlForWebview(webview: vscode.Webview) {
//     const scriptUri = webview.asWebviewUri(
//       vscode.Uri.joinPath(this._extensionUri, "out", "compiled/Logs.js")
//     );

//     const cssUri = webview.asWebviewUri(
//       vscode.Uri.joinPath(this._extensionUri, "out", "compiled/Logs.css")
//     );

//     const stylesResetUri = webview.asWebviewUri(
//       vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
//     );

//     const tailwindUri = webview.asWebviewUri(
//       vscode.Uri.joinPath(
//         this._extensionUri,
//         "media",
//         "scripts",
//         "tailwind.min.js"
//       )
//     );

//     const showdownUri = webview.asWebviewUri(
//       vscode.Uri.joinPath(
//         this._extensionUri,
//         "media",
//         "scripts",
//         "showdown.min.js"
//       )
//     );

//     const microlightUri = webview.asWebviewUri(
//       vscode.Uri.joinPath(
//         this._extensionUri,
//         "media",
//         "scripts",
//         "microlight.min.js"
//       )
//     );


//     // Use a nonce to only allow specific scripts to be run
//     const nonce = getNonce();

//     return `<!DOCTYPE html>
//             <html lang="en">
//                 <head>
//                     <meta charset="UTF-8">
//                     <!--
//                         Use a content security policy to only allow loading images from https or from our extension directory,
//                         and only allow scripts that have a specific nonce.
//                     -->
//                     <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
//                         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                         <link href="${stylesResetUri}" rel="stylesheet">
                        
//                     <script src="${tailwindUri}" nonce="${nonce}"></script>
//                     <script src="${showdownUri}" nonce="${nonce}"></script>
//                     <script src="${microlightUri}" nonce="${nonce}"></script>
//                     <link href="${cssUri}" rel="stylesheet">
//                     <script nonce="${nonce}">
//                         const vscode = acquireVsCodeApi();
//                     </script>
//                 </head>
//                 <body class="p-0">
//                 </body>
//                 <script nonce="${nonce}" src="${scriptUri}"></script>
//             </html>`;
//   }
// }