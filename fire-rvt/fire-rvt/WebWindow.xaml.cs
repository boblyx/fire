using Autodesk.Revit.UI;
using System;
using System.Windows;
using System.Windows.Input;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.Wpf;
using Newtonsoft.Json;
using System.Diagnostics;

namespace fire_rvt
{
    public partial class WebWindow : Window
    {
        private LaunchWeb launch_web;
        public UIApplication uiApp;
        public bool isLoaded = false;
        public WebView2 web_view;

        public WebWindow(UIApplication app)
        {
            InitializeComponent();
            launch_web = new LaunchWeb(app, webView);
            DataContext = launch_web;
            launch_web.CloseAction = new Action(this.Close);
            uiApp = app;
            web_view = webView;
        }

        internal class WvReceiveAction
        {
            public string action;
            public object payload;
        }

        private async void OnWebViewInteraction(object sender, CoreWebView2WebMessageReceivedEventArgs e)
        {
            WvReceiveAction result = null;
            try
            {
                result = JsonConvert.DeserializeObject<WvReceiveAction>(e.WebMessageAsJson);
                Debug.WriteLine(result.action);
            }
            catch (Exception exception)
            {
                Debug.WriteLine(exception);
            }

            if(result == null) { return; };

            switch (result.action)
            {
                case "test":
                    // Call a JS function from Revit
                    await webView.CoreWebView2.ExecuteScriptAsync("testFromWV2()");
                    break;

                case "loaded":
                    // Callback from WebView2
                    Debug.WriteLine("Commencing payload assembly");
                    isLoaded = true;
                    //App.rvtHandler.Raise(RevitEventHandler.RevitActionsEnum.Loaded);
                    break;
                default:
                    Debug.WriteLine("Unhandled action. Ignoring.");
                    break;
            }
        }

        public async void SendPayload(string payload)
        {
            string payloadScript = "sendPayload(" + "{"+payload+"}" + ")";
            var res1 = await webView.CoreWebView2.ExecuteScriptAsync(payloadScript);
            Debug.WriteLine(res1);
            return;
        }

        private void DragWindow(object sender, MouseButtonEventArgs e)
        {
            try
            {
                DragMove();
            }
            catch { }
        }
    }
}
