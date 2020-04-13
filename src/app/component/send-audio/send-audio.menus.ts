import { Category, MenuRoute } from "src/app/interfaces/menusInterfaces";
import { StrongRoute } from "src/app/interfaces/strongRoute";
import { homeCategory } from "../home/home.menus";

export const sendAudioRoute = StrongRoute.Base.add("send_audio");
export const sendAudioCategory: Category = homeCategory;
export const sendAudioMenuItem = MenuRoute({
  icon: ["fas", "envelope"],
  label: "Send Audio",
  route: sendAudioRoute,
  tooltip: () => "Send us audio recordings to upload",
  order: 8
});
