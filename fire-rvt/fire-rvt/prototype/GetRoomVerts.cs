/*
 * Created by SharpDevelop.
 * User: BobLYX
 * Date: 3/31/2024
 * Time: 12:13 PM
 * 
 * To change this template use Tools | Options | Coding | Edit Standard Headers.
 */
using System;
using Autodesk.Revit.UI;
using Autodesk.Revit.DB;
using Autodesk.Revit.DB.Architecture;
using Autodesk.Revit.UI.Selection;
using System.Collections.Generic;
using System.Linq;
using System.Diagnostics;

namespace GetVerts
{
    [Autodesk.Revit.Attributes.Transaction(Autodesk.Revit.Attributes.TransactionMode.Manual)]
    [Autodesk.Revit.DB.Macros.AddInId("C79AC040-5D22-4E1B-81FD-B34EF4B64F56")]
	public partial class ThisApplication
	{
		private void Module_Startup(object sender, EventArgs e)
		{
			
		}

		private void Module_Shutdown(object sender, EventArgs e)
		{
			
		}
		
		public void GetRoomVerts(){
		
			Debug.WriteLine("Test");
			var doc = this.ActiveUIDocument.Document;
			FilteredElementCollector rmCollect = new FilteredElementCollector(doc);
			var rms = rmCollect.OfClass(typeof(Room));
			List<List<List<double[]>>> rooms_bounds = new List<List<List<double[]>>>();
			foreach (Room rm in rms) 
			{
				IList<IList<BoundarySegment>> segments = rm.GetBoundarySegments(new SpatialElementBoundaryOptions());
				if ( segments == null) { continue; }
				List<List<double[]>> loops = new List<List<double[]>>{};
				foreach( IList<BoundarySegment> lbseg in segments)
				{
					List<double[]> lines = new List<double[]>();
					foreach(BoundarySegment bseg in lbseg)
					{
						
						lines.Add(new double[]{bseg.GetCurve().GetEndPoint(0).X
						          		,bseg.GetCurve().GetEndPoint(0).Y
						          		,bseg.GetCurve().GetEndPoint(0).Z});
						lines.Add(new double[]{bseg.GetCurve().GetEndPoint(1).X
						          		,bseg.GetCurve().GetEndPoint(1).Y
						          		,bseg.GetCurve().GetEndPoint(1).Z});
					}
					loops.Add(lines);
				}
				rooms_bounds.Add(loops);
				break;
			}
		}

		#region Revit Macros generated code
		private void InternalStartup()
		{
			this.Startup += new System.EventHandler(Module_Startup);
			this.Shutdown += new System.EventHandler(Module_Shutdown);
		}
		#endregion
	}
}