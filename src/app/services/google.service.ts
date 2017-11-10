import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { WindowRefService } from "../services/windowref.service";

declare var gapi: any;
@Injectable()
export class GoogleService {
  private _baseUrl: string;
  private _window: any;
  private _urlshortener: any;
  private _OAuth2: any;
  private _oauth2Client: any;
  private _scopes = [
    "https://www.googleapis.com/auth/contacts.readonly",
    "https://www.googleapis.com/auth/calendar",
    "profile"
  ];
  private _url: any;

  constructor(windowRef: WindowRefService) {
    this._window = windowRef.nativeWindow;
    this._baseUrl = `${this._window.location.protocol}//${this._window.location
      .hostname}:${this._window.location.port}/googlecallback`;
/*     this._oauth2Client = new this._OAuth2(
      "",
      "nJt4pZgs-U7VXhak7YAxGSLM",
      this._baseUrl
    ); */



    gapi.load("auth2", () => {
      this._oauth2Client = gapi.auth2.init({
        client_id:
          "783669865413-v8no6fp43ljeebqdd69km4gnnivq1otk.apps.googleusercontent.com",
        cookie_policy: "single_host_origin",
        scope: this._scopes
      });
      this._oauth2Client.attachClickHandler(
        document.getElementById("googleres"),
        {},
        this.onSingIn,
        this.onFailure
      );
    });
  }

  private onSingIn(){

  }

  private onFailure(){

  }

  private initClient() {
    // Initialize the client with API key and People API, and initialize OAuth with an
    // OAuth 2.0 client ID and scopes (space delimited string) to request access.
    gapi.client
      .init({
        apiKey: "AIzaSyBaw7OWQKc74-MAp09WLYnb21bxRavRkPc",
        discoveryDocs: [
          "https://people.googleapis.com/$discovery/rest?version=v1"
        ],
        clientId: "783669865413-v8no6fp43ljeebqdd69km4gnnivq1otk.apps.googleusercontent.com",
        scope: this._scopes
      })
      .then(function() {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);

        // Handle the initial sign-in state.
        this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
  }

  private updateSigninStatus(isSignedIn) {
    // When signin status changes, this function is called.
    // If the signin status is changed to signedIn, we make an API call.
    if (isSignedIn) {
      this.makeApiCall();
    }
  }

  private handleSignInClick(event) {
    // Ideally the button should only show up after gapi.client.init finishes, so that this
    // handler won't be called before OAuth is initialized.
    gapi.auth2.getAuthInstance().signIn();
  }

  private handleSignOutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
  }

  private makeApiCall() {
    // Make an API call to the People API, and print the user's given name.
    gapi.client.people.people
      .get({
        resourceName: "people/me",
        "requestMask.includeField": "person.names"
      })
      .then(
        function(response) {
          console.log("Hello, " + response.result.names[0].givenName);
        },
        function(reason) {
          console.log("Error: " + reason.result.error.message);
        }
      );
  }
}
