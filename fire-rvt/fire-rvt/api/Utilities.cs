using System;
using Autodesk.Revit.UI;
using Autodesk.Revit.DB;
using Autodesk.Revit.DB.Architecture;
using Autodesk.Revit.UI.Selection;
using System.Collections.Generic;
using System.Linq;
using System.Diagnostics;
/// <summary>
/// Author: Bob YX Lee
/// </summary>
namespace fire_rvt.api
{
    class Utilities
    {
        public static ForgeTypeId mmTypeId = new ForgeTypeId("autodesk.unit.unit:millimeters-1.0.1");
        public static ForgeTypeId sqmTypeId = new ForgeTypeId("autodesk.unit.unit:squareMeters-1.0.1");

        public static double sqm(double value) {
            return UnitUtils.ConvertFromInternalUnits(value, sqmTypeId);
        }

        public static double mm(double value) {
            //ForgeTypeId mmTypeId = new ForgeTypeId("autodesk.unit.unit:millimeters-1.0.1");
            return UnitUtils.ConvertFromInternalUnits(value, mmTypeId);
        }

        /// <summary>
        /// QOL utility for checking if geometry is Solid.
        /// </summary>
        /// <param name="geom"></param>
        /// <returns></returns>
        public static bool isSolid(object geom)
        {
            if (null == geom) { return false; }
            if (geom.GetType() == typeof(Autodesk.Revit.DB.Solid)) { return true; }
            else { return false; }
        }

        /// <summary>
        /// QOL utility for checking if geometry is GeometryInstance.
        /// </summary>
        /// <param name="geom"></param>
        /// <returns></returns>
        public bool isGeometryInstance(object geom)
        {
            if (null == geom) { return false; }
            if (geom.GetType() == typeof(Autodesk.Revit.DB.GeometryInstance)) { return true; }
            else { return false; }
        }

        /// <summary>
        /// Checks if values in 2 vertices are all the same.
        /// </summary>
        /// <param name="v1"></param>
        /// <param name="v2"></param>
        /// <param name="dims"></param>
        /// <returns></returns>
        public static bool vequals(double[] v1, double[] v2, int dims = 2)
        {
            for (int i = 0; i < dims; i++)
            {
                if (v1[i] != v2[i]) { return false; }
            }
            return true;
        }

        /// <summary>
        /// Checks if vertex indices in 2 faces are all the same.
        /// </summary>
        /// <param name="fl1"></param>
        /// <param name="fl2"></param>
        /// <returns></returns>
        public static bool fequals(List<int> fl1, List<int> fl2)
        {
            int matches = 0;
            for (int i = 0; i < fl1.Count; i++)
            {
                if (fl1[i] == fl2[i])
                {
                    matches += 1;
                }
            }
            if (matches == fl1.Count)
            {
                return true;
            }
            return false;
        }

        /// <summary>
        /// Returns index of first match querying a list of coordinates with a test coordinate.
        /// </summary>
        /// <param name="l">The List to search.</param>
        /// <param name="v">The value to search for.</param>
        /// <returns></returns>
        public static int firstMatch(List<double[]> l, double[] v)
        {
            for (int i = 0; i < l.Count; i++)
            {
                double[] lv = l[i];
                if (!(vequals(lv, v))) { continue; }
                return i;
            }
            return -1;
        }

        /// <summary>
        /// Returns true if there are duplicate elements in the same List.
        /// </summary>
        /// <param name="fl"></param>
        /// <returns></returns>
        public static bool hasDupIndex(List<int> fl)
        {
            var g = fl.GroupBy(i => i);
            foreach (var grp in g)
            {
                if (grp.Count() > 1) { return true; }
            }
            return false;
        }

        /// <summary>
        /// Checks if contents of List fl1 are the same as
        /// fl2, disregarding order of elements
        /// </summary>
        /// <param name="fl1">List to compare</param>
        /// <param name="fl2">Other List to check against</param>
        /// <returns></returns>
        public static bool hasSameIndices(List<int> fl1, List<int> fl2)
        {
            int matches = 0;
            foreach (int vid in fl1)
            {
                if (!(fl2.Contains(vid))) { continue; }
                matches += 1;
            }
            if (matches == fl1.Count)
            {
                return true;
            }
            return false;
        }

        /// <summary>
        /// Converts a Revit 3D mesh representation of a room
        /// into a 2D mesh as JSON
        /// </summary>
        /// <param name="geomObj"></param>
        /// <returns></returns>
        public static NavMesh toMesh(object geomObj)
        {
            Solid solid = (Solid)geomObj;
            FaceArray faces = solid.Faces;
            List<double[]> vertices = new List<double[]> { };
            List<List<int>> ifaces = new List<List<int>> { };
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
                        double[] v = new double[] { mm(vert.X), mm(vert.Y) };
                        bool has_dup = false;
                        foreach (double[] vi in vertices)
                        {
                            if (vequals(vi, v, 2))
                            {
                                has_dup = true;
                                break;
                            }
                        }
                        if (has_dup == false)
                        {
                            vertices.Add(v);
                        }
                        int fv = firstMatch(vertices, v);
                        trilist.Add(fv);
                    }
                    // Check if the list already has all indices containing the same numbers. If so, don't add to the list
                    if (hasDupIndex(trilist)) { continue; }

                    // Check if list has duplicate vindices. If so, don't add to the facelist
                    bool has_fdup = false;
                    foreach (List<int> otri in ifaces)
                    {
                        if (hasSameIndices(otri, trilist))
                        {
                            has_fdup = true;
                            break;
                        }
                    }
                    if (has_fdup == true) { continue; }
                    ifaces.Add(trilist);
                }
            }
            return new NavMesh(vertices, ifaces);
        }
    }
}
