using System;
using Autodesk.Revit.UI;
using System.Diagnostics;
using Microsoft.Web.WebView2.Wpf;
using Microsoft.Web.WebView2.Core;
using System.IO;

namespace fire_rvt
{
    public class LaunchWeb
    {
        private WebView2 web_view;
        public Action CloseAction { get; set; }
        private const string DEFAULT_FOLDER = "C:/Temp";
        private const string FAKE_URL = "http://fire/";

        internal LaunchWeb(UIApplication a, WebView2 web_view)
        {
            this.web_view = web_view;
            this.LoadContent();
        }

        private async void LoadContent()
        {
            CoreWebView2Environment env = await CoreWebView2Environment.CreateAsync(userDataFolder: DEFAULT_FOLDER);
            await web_view.EnsureCoreWebView2Async(env);

            web_view.CoreWebView2.AddWebResourceRequestedFilter(FAKE_URL + "*",
                CoreWebView2WebResourceContext.All
                );
            web_view.CoreWebView2.WebResourceRequested += delegate (object sender,
                CoreWebView2WebResourceRequestedEventArgs args)
            {
                string assets_file_path = Utilities.AssemblyDirectory
               + "/ui/" + args.Request.Uri.Substring((FAKE_URL + "*").Length - 1);

                Debug.WriteLine(Utilities.AssemblyDirectory);
                Debug.WriteLine(assets_file_path);
                Debug.WriteLine(args.Request.Uri);

                try
                {
                    FileStream fs = File.OpenRead(assets_file_path);
                    ManagedStream ms = new ManagedStream(fs);
                    string headers = "";
                    if (assets_file_path.EndsWith(".html"))
                    {
                        headers = "Content-Type: text/html";
                    }
                    else if (assets_file_path.EndsWith(".jpg"))
                    {
                        headers = "Content-Type: image/jpeg";
                    }
                    else if (assets_file_path.EndsWith(".png"))
                    {
                        headers = "Content-Type: image/png";
                    }
                    else if (assets_file_path.EndsWith(".css"))
                    {
                        headers = "Content-Type: text/css";
                    }
                    else if (assets_file_path.EndsWith(".js"))
                    {
                        headers = "Content-Type: application/javascript";
                    }
                    else if (assets_file_path.EndsWith(".json")
                            || assets_file_path.EndsWith(".map"))
                    {
                        headers = "Content-Type: application/json";
                    }
                    args.Response = web_view.CoreWebView2.Environment.CreateWebResourceResponse(
                                                            ms, 200, "OK", headers);
                }
                catch (Exception ex)
                {
                    Debug.WriteLine("Failed to get.");
                    Debug.WriteLine(ex.Message);
                    args.Response = web_view.CoreWebView2.Environment.CreateWebResourceResponse(
                                                        null, 404, "Not found", "");
                }
            };
            web_view.CoreWebView2.Navigate(FAKE_URL+"index.html");
        }
    }

}
