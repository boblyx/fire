using System;
using Autodesk.Revit.UI;
using Autodesk.Revit.DB;
using Autodesk.Revit.DB.Architecture;
using Autodesk.Revit.UI.Selection;
using System.Collections.Generic;
using System.Linq;
using System.Diagnostics;

namespace fire_rvt.api
{
    class Utilities
    {
        public static bool isSolid(object geom)
        {
            if (null == geom) { return false; }
            if (geom.GetType() == typeof(Autodesk.Revit.DB.Solid)) { return true; }
            else { return false; }
        }

        public static bool isGeometryElement(object geom)
        {
            return true;
        }

        public bool isGeometryInstance(object geom)
        {
            if (null == geom) { return false; }
            if (geom.GetType() == typeof(Autodesk.Revit.DB.GeometryInstance)) { return true; }
            else { return false; }
        }

        public static bool vequals(double[] v1, double[] v2)
        {
            for (int i = 0; i < v1.Count(); i++)
            {
                if (v1[i] != v2[i]) { return false; }
            }
            return true;
        }

        public static NavMesh toMesh(object geomObj)
        {
            Solid solid = (Solid)geomObj;
            FaceArray faces = solid.Faces;
            List<double[]> vertices = new List<double[]> { };
            List<List<int>> ifaces = new List<List<int>> { };
            // First pass, record all vertices
            // Second pass
            foreach (Face face in faces)
            {
                var mesh = face.Triangulate();
                for (int i = 0; i < mesh.NumTriangles; i++)
                {
                    List<int> trilist = new List<int> { };
                    MeshTriangle triangle = mesh.get_Triangle(i);
                    XYZ v1 = triangle.get_Vertex(0);
                    XYZ v2 = triangle.get_Vertex(1);
                    XYZ v3 = triangle.get_Vertex(2);
                    List<XYZ> verts = new List<XYZ> { v1, v2, v3 };
                    foreach (XYZ vert in verts)
                    {
                        double[] v = new double[] { vert.X, vert.Y, vert.Z };
                        bool has_dup = false;
                        foreach (double[] vi in vertices)
                        {
                            if (vequals(vi, v))
                            {
                                has_dup = true;
                                break;
                            }
                        }
                        if (has_dup == false)
                        {
                            vertices.Add(v);
                        }
                        int fv = vertices.IndexOf(v);
                        trilist.Add(fv);
                    }
                    // Generate facelist
                    ifaces.Add(trilist);
                }
            }

            //Debug.WriteLine(vertices.Count);
            //Debug.WriteLine(ifaces.Count); 
            return new NavMesh(vertices, ifaces);
        }
    }
}
