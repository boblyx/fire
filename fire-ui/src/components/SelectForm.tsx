/**
 * SelectForm.tsx
 * Component for rendering dropdown boxes for 
 * users to select floors / rooms 
 */
import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import axios from "axios";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResultContext } from "../contexts/ResultContext";

import { Button } from "../components/ui/button";
import { useToast } from "../components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";

import { SAMPLE_FLOORS } from "./samples/floor_exts";
import { CheckResultProps, InferResultProps } from "./Interfaces";
import { RoomProps, FloorProps } from "../contexts/ResultContext";
const API_FIRE_OPT = process.env.REACT_APP_API_FIRE_OPT;
const ENDPOINTS = {

    "/check/coverage": `${API_FIRE_OPT}/check/coverage`
    ,"/ext_solve_all": `${API_FIRE_OPT}/ext_solve_all`
    ,"ai/check": "http://localhost:5000/predict"
}
// TODO: Props to be changed based on result output of AI model
interface ResultProps {
  setCheckResults: Dispatch<SetStateAction<CheckResultProps[]>>;
  setInferResults: Dispatch<SetStateAction<InferResultProps[]>>;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Floor name is required." }),
  room_name: z.string().min(1, { message: "Room name is required." }),
});

// Dummy floor data - TO REMOVE LATER
let floorList: FloorProps[] = SAMPLE_FLOORS;

const SelectForm: React.FC<ResultProps> = ({
  setCheckResults,
  setInferResults,
}) => {
  const context = useContext(ResultContext);
  const {
    allFloors,
    setAllFloors,
    allRooms,
    setAllRooms,
    currentRoom,
    setCurrentRoom,
    currentFloor,
    setCurrentFloor,
    checkResultData,
    setCheckResultData
  } = context;

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      room_name: "",
    },
  });

  const { control, formState, handleSubmit, watch, reset } = form;

  const isLoading = formState.isSubmitting;

  // Reads user input for floor name field.
  const floorNameValue = watch("name");

  // TODO: To amend this useEffect method once api endpoint is confirmed. useEffect only runs once on mount.
  useEffect(() => {
    /*
    getFloors().then(setAllFloors).catch(error => console.error('Failed to fetch floors:', error))
    */
    setAllFloors(floorList);
  }, []);

  useEffect(() => {
  }, [floorNameValue]);

  let use_ai = false;

  function toggleAI(){
    if(use_ai == false){
      use_ai = true;
    }else{
      use_ai = false;
    }
  }

  /**
   * TODO: Scale vertices if they are too small.
   * @author Bob YX Lee
   */
  async function checkExtinguisherPlacement(){
    let cdata = checkResultData[0]
    let vertices = cdata.room_vertices;
    let obs_verts = cdata.obstacle_vertices;
    let navmesh = currentRoom.navmesh;
    
    let payload = {
        room_dict : {
           vertices:  vertices,
           obstacles: obs_verts,
        },
        navmesh: navmesh,
        exts : cdata.extinguisher_vertices
    }

    // FOR DEBUG. DO NOT REMOVE
    console.log(JSON.stringify(payload));

    try{
    const response = await axios.post(
      ENDPOINTS["/check/coverage"],
      payload,
    );

    let res : any = response.data

    if(Object.keys(res).includes("error")){
        console.log("Error occurred");
        return;
    }
    
    let new_chk : CheckResultProps = checkResultData[0];

    if(res.comply === true){
        new_chk.result = "PASS";
    }else{
        new_chk.result = "FAIL";
    }
    
    new_chk.uncovered = res.cover.diff;
    new_chk.paths = res.travel.paths;
    console.log(res);
    setCheckResultData([new_chk]);
    // FIXME: toast doesn't seem to work
    toast({
        variant: "success",
        title: "Success!",
        description: "Room data exported successfully.",
      });

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Failure to submit room data. Please try again.",
    });
   }
  }

  function vequals(v1 : number[], v2 : number[]){
    for(let i = 0; i < v1.length; i++){
        if(v1[i] !== v2[i]){ return false}
    }
    return true;
  }

  const inferExtinguisherCompliance = async (values: z.infer<typeof formSchema>) =>{
    let cdata = checkResultData[0];
    let vertices = cdata.room_vertices;
    let extinguishers = cdata.extinguisher_vertices;
    let payload = {"room": vertices, "extinguishers": extinguishers };

    const response = await axios.post(ENDPOINTS["ai/check"], payload);
    let res : any = response.data
    if(Object.keys(res).includes("error")){
        console.log("Error occurred");
        return;
    }
    console.log(res);
  }

  // Handle form submit for inference
  // TODO: Stub function to do post request to fire infer API to do check. Change the API URL accordingly.
  const inferExtinguisherPlacement = async (
    values: z.infer<typeof formSchema>,
  ) => {
    let cdata = checkResultData[0];
    let vertices = cdata.room_vertices;
    let obs_verts = cdata.obstacle_vertices;
    let navmesh = currentRoom.navmesh;
    
    let payload = {
        room_dict : {
            vertices: vertices,
            obstacles: obs_verts
        },
        navmesh: navmesh,
        exts: cdata.extinguisher_vertices,
        resolution: {"units": 1000}
    }

    console.log(JSON.stringify(payload));

    try {
        const response = await axios.post(ENDPOINTS["/ext_solve_all"], payload);
        let res : any = response.data
        if(Object.keys(res).includes("error")){
            console.log("Error occurred");
            return;
        }
        let new_chk : CheckResultProps = checkResultData[0];
        let cexts = new_chk.extinguisher_vertices;
        console.log(new_chk);
        console.log(res);
        let suggested_exts : number[][] = [];
        // Skip extinguishers that already exist
        // Should have a endpoint argument to return all
        // exts, or only return new exts to avoid to have to do this.
        for(let n = 0; n < res.exts.length; n++){
            let ext : number[] = res.exts[n];
            let present = false;
            for(let i = 0; i < cexts.length; i++){
                let cext : number[] = cexts[i];
                if(vequals(cext, ext)){ present = true; break;}
            }
            // HACK: Ignore errors from solver
            // Where same point is suggested over and over again.
            for(let i = 0; i < suggested_exts.length; i++){
              let cext : number[] = suggested_exts[i];
              if(vequals(cext,ext)){present = true; break;}
            }
            if(present){ continue; }
            suggested_exts.push(ext);
        }
        console.log(suggested_exts);
        new_chk.suggested_exts = suggested_exts;
        setCheckResultData([new_chk]);
    }catch(err){
        console.log(err);
    }
  };

  /**
   * Triggers population of rooms dropdown to get Room info.
   * @author Bob YX Lee
   */
  function getRooms(e : string){
    console.log("Getting Rooms!");
    console.log(allFloors);
    console.log(e);
    let the_floor : any = null;
    for(let i = 0; i < allFloors.length; i++){
      if(e !== allFloors[i].name){ continue }
      the_floor = allFloors[i] as FloorProps;
    }
    if (the_floor == null){ return; };

    // Since floors already contain room info,
    // We can just load directly from the floor collection
    
    setCurrentFloor(the_floor);
    setAllRooms(the_floor.rooms);
    // TODO change room placeholder to say: "Select Room"
    // when rooms are loaded
  }
  /**
   * Triggers draw room routine.
   */
  function drawRoom(e : string){
    console.log("Drawing room!");
    console.log(currentFloor);
    console.log(e);
    if((currentFloor?.rooms == undefined)){return;}
    // Get the room
    let the_room : any;
    for(let i = 0; i < currentFloor.rooms.length; i++){
        let c_rm = currentFloor.rooms[i];
        if(!(c_rm.name == e)){ continue; }
        the_room = c_rm;
        break;
    }
    if(the_room == undefined){ return; }
    setCurrentRoom(the_room);
    document.dispatchEvent(new CustomEvent('show-plan'));
    return;
  }

  // Reset form fields upon successful submission
  useEffect(() => {
      document.addEventListener("setAllFloors", (e : any) => {
        // FIXME: To avoid multiple event updates...
        // Currently its because event listener is on all SelectForm instances...
        // May need to differentiate it.
        console.log("Setting all floors!");
        console.log(e);
        setAllFloors(e.detail);
      });

    if (formState.isSubmitSuccessful) {
      reset({ name: "", room_name: "" });
    }
  }, [formState, reset]);

  return (
    <div className="border border-primary/10 rounded-md bg-gray-200 drop-shadow-md h-full p-3">
      <Form {...form}>
        <form
          //AI: inferExtinguisherComliance RB: checkExtinguisherPlacement
          onSubmit={handleSubmit(checkExtinguisherPlacement)}//inferExtinguisherCompliance)}//checkExtinguisherPlacement)}
          className="space-y-4"
        >
          <FormField
            name="name"
            control={control}
            render={({ field }) => (
              <FormItem id="floor-select" className="col-span-1 md:col-span-1">
                <FormLabel className="text-lg font-bold flex justify-start">
                  Floor
                </FormLabel>
                <Select
                  disabled={isLoading || allFloors.length === 0}
                  onValueChange={(e)=>{field.onChange(e); getRooms(e)}} // Trigger when floor is selected to get the floor's rooms
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-background">
                      <SelectValue
                        defaultValue={field.value}
                        placeholder="Select Floor"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent >
                    {allFloors?.map((floor) => (
                      <SelectItem key={floor.id} value={floor.name}>
                        {floor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="room_name"
            control={control}
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-1">
                <FormLabel className="text-lg font-bold flex justify-start">
                  Room
                </FormLabel>
                <Select
                  disabled={isLoading || allRooms.length === 0}
                  onValueChange={(e) => {field.onChange(e); drawRoom(e)}}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-background">
                      <SelectValue
                        defaultValue={field.value}
                        placeholder="Select a Floor First"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {allRooms?.map((room) => (
                      <SelectItem key={room.id} value={room.name}>
                        {room.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex justify-start space-x-4 pt-10">
            <Button disabled={isLoading}>Check</Button>
            <Button
              disabled={isLoading}
              onClick={handleSubmit(inferExtinguisherPlacement)}
            >
              Suggest
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SelectForm;
