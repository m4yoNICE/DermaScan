import axios from "axios";

const baseURL = "192.168.56.1:3000"; //ip address differ device to device, pls go to CMD and type "ipconfig" and copypaste the ipaddress
                                    // dont forget to put the port number, express for now is at :3000
                                     //                                         -jasperbayot
const Http = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
});

export default Http;
