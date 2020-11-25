import { homeCategory } from "@components/home/home.menus";
import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";

export const sendAudioRoute = StrongRoute.base.add("send_audio");
export const sendAudioCategory: Category = homeCategory;
export const sendAudioMenuItem = menuRoute({
  icon: ["fas", "envelope"],
  label: "Send Audio",
  route: sendAudioRoute,
  tooltip: () => "Send us audio recordings to upload",
  order: 8,
});
