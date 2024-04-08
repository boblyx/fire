using System;
using System.Diagnostics;
using Autodesk.Revit.UI;
using Autodesk.Revit.DB;
using Autodesk.Revit.DB.Analysis;
using Autodesk.Revit.UI.Selection;
using System.Collections.Generic;
using Autodesk.Revit.DB.Architecture;
using System.Linq;
using System.Text.Json;
/// <summary>
/// For getting information from the Revit model
/// TODO: 
/// - Generate Navmeshes
/// - Add extinguishers
/// Author: Bob Lee
/// </summary>
namespace fire_rvt.api
{ 
    // FLOOR SCHEMA
    public class FloorInfo
    {
        public string id { get; set; }
        public string name { get; set; }
        public List<RoomInfo> rooms { get; set; }

        public FloorInfo(string id, string name, List<RoomInfo> rooms) {
            this.id = id;
            this.name = name;
            this.rooms = rooms;
        }
    }
    public class LevelList
    {
        public List<FloorInfo> Floors { get; set; }

        public LevelList() {
            Floors = new List<FloorInfo>();
        }
    }
    // END FLOOR SCHEMA

    // ROOM SCHEMA
    public class RoomInfo
    {
        public string id { get; set; }
        public string name { get; set; }
        public string level { get; set; }
        public List<List<List<double[]>>> vertices { get; set; }
        public List<double[]> extinguishers { get; set; }
        public NavMesh navmesh { get; set; }

        public RoomInfo(string id, string name,
            string level, List<List<List<double[]>>> vertices, 
            NavMesh navmesh, List<double[]> extinguishers)
        {
            this.id = id;
            this.name = name;
            this.level = level;
            this.vertices = vertices;
            this.navmesh = navmesh;
            this.extinguishers = extinguishers;
        }
    }

    public class RoomList
    {
        public List<RoomInfo> Rooms { get; set; }

        public RoomList() {
            Rooms = new List<RoomInfo>();
        }
    }

    public class NavMesh
    {
        public List<List<int>> faces { get; set; }
        public List<double[]> vertices { get; set; }

        public NavMesh(List<double[]> vertices, List<List<int>> faces) {
            this.vertices = vertices;
            this.faces = faces;
        }
    }
    // END ROOM SCHEMA

    public class Info
    {
        public static string GetFloors(UIApplication app)
        {
            var uiDoc = app.ActiveUIDocument;
            var doc = uiDoc.Document;
            FilteredElementCollector flrCollect = new FilteredElementCollector(doc);
            var flrs = flrCollect.OfClass(typeof(Level));
            LevelList lvlist = new LevelList();
            // Get all rooms first them assign them to the correct floor
            List<RoomInfo> lvlrooms = new List<RoomInfo>();
            var rms = GetRooms(app);
            Dictionary<string, List<RoomInfo>> indxRms = new Dictionary<string, List<RoomInfo>>();
            foreach (RoomInfo rm in rms.Rooms)
            {
                if(!indxRms.ContainsKey(rm.level))
                {
                    indxRms[rm.level] = new List<RoomInfo>();
                }
                indxRms[rm.level].Add(rm);
            }
            foreach (Level flr in flrs)
            {
                lvlist.Floors.Add(new FloorInfo(flr.UniqueId, flr.Name, indxRms[flr.UniqueId]));
            }
            string jsonst = JsonSerializer.Serialize(lvlist);
            Debug.WriteLine(jsonst);
            return jsonst;
        }

        public static RoomList GetRooms(UIApplication app)
        {
            var doc = app.ActiveUIDocument.Document;
            FilteredElementCollector rmCollect = new FilteredElementCollector(doc);
            var rms = rmCollect.OfClass(typeof(SpatialElement));
            RoomList rmlist = new RoomList();
            foreach (Room rm in rms)
            {
                // Get all info first
                string id = rm.UniqueId;
                string name = rm.Name;
                string lvl = rm.Level.UniqueId;
                List<List<List<double[]>>> verts = GetRoomLines(rm);
                rmlist.Rooms.Add(new RoomInfo(id, name, lvl, verts)); // TO UPDATE
            }
            //string jsonst = JsonSerializer.Serialize(rmlist);
            //Debug.WriteLine(jsonst);
            //return jsonst;
            return rmlist;
        }
        
        // TODO
        public static NavMesh GetNavMesh(Room room)
        {
            // Get .Geometry of the Room element
            // Extract X,Y of each vertices and put them into a list, ignoring those with duplicate X, Y coords
            // loop through face list and discard facelists for which indices cant be found in above list
            GeometryElement rm_geom = room.get_Geometry(new Options());
            List<NavMesh> meshes = new List<NavMesh> { };
            foreach (var geom in rm_geom)
            {
                if (!Utilities.isSolid(geom)) { continue; }
                meshes.Add(Utilities.toMesh(rm_geom));
            }
            //if (meshes.Count() == 0) { return NavMesh() };
            return meshes[0];
        }
        
        /// <summary>
        /// Example:
        /// [
        ///   [ // 0th is the main large boundary
        ///     [
        ///       [0,1], [1,2]
        ///     ],
        ///     [
        ///     [1,2], [3,4]
        ///     ]
        ///   ],
        ///   [ // 1 onwards are obstacles
        ///       ....
        ///   ]
        /// ]
        /// </summary>
        /// <param name="rm"></param>
        /// <returns></returns>
        public static List<List<List<double[]>>> GetRoomLines(Room rm)
        {
            IList<IList<BoundarySegment>> segments = rm.GetBoundarySegments(new SpatialElementBoundaryOptions());
            Debug.WriteLine(segments.ToString());
            if (segments == null) { return new List<List<List<double[]>>> { }; } // Skip unbounded rooms
            List<List<List<double[]>>> loops = new List<List<List<double[]>>> { };
            foreach (IList<BoundarySegment> lbseg in segments)
            {
                List<List<double[]>> lines = new List<List<double[]>>();
                foreach (BoundarySegment bseg in lbseg)
                {
                    List<double[]> coords = new List<double[]>();
                    // Line Start point
                    coords.Add(new double[]{bseg.GetCurve().GetEndPoint(0).X
                                          ,bseg.GetCurve().GetEndPoint(0).Y
                                          ,bseg.GetCurve().GetEndPoint(0).Z});

                    // Line End Point
                    coords.Add(new double[]{bseg.GetCurve().GetEndPoint(1).X
                                          ,bseg.GetCurve().GetEndPoint(1).Y
                                          ,bseg.GetCurve().GetEndPoint(1).Z});
                    lines.Add(coords);
                }
                loops.Add(lines);
            }
            return loops;
        }
    }
}
