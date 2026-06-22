import type { ConfigTile } from "./types";
import animate1 from "@/assets/animate/tile-1.mp4";
import animate2 from "@/assets/animate/tile-2.mp4";
import animate3 from "@/assets/animate/tile-3.mp4";
import animate4 from "@/assets/animate/tile-4.mp4";
import animate5 from "@/assets/animate/tile-5.mp4";
import beach from "@/assets/backgrounds/beach.png";
import cityDusk from "@/assets/backgrounds/city-dusk.png";
import living from "@/assets/backgrounds/living.png";
import myPhoto from "@/assets/backgrounds/my-photo.png";
import office from "@/assets/backgrounds/office.png";
import party from "@/assets/backgrounds/party.png";
import street from "@/assets/backgrounds/street.png";
import studioCold from "@/assets/backgrounds/studio-cold.png";
import studioGray from "@/assets/backgrounds/studio-gray.png";
import studioPhoto from "@/assets/backgrounds/studio-photo.png";
import studioWarm from "@/assets/backgrounds/studio-warm.png";

export const defaultBackgroundTiles: ConfigTile[] = [
  { id: "studio-photo", label: "фотостудия", image: studioPhoto },
  { id: "studio-cold", label: "студия холодный", image: studioCold },
  { id: "studio-warm", label: "студия тёплый", image: studioWarm },
  { id: "studio-gray", label: "студия серый", image: studioGray },
  { id: "my-photo", label: "как на моем фото", image: myPhoto },
  { id: "office", label: "офис", image: office },
  { id: "home", label: "дом", image: living },
  { id: "party", label: "вечеринка", image: party },
  { id: "street-city", label: "улица (город)", image: street },
  { id: "restaurant", label: "ресторан", tint: "#6b5344" },
  { id: "beach", label: "пляж", image: beach },
  { id: "city-dusk", label: "город сумерки", image: cityDusk },
  { id: "museum", label: "музей", tint: "#8a8578" },
  { id: "pajama", label: "пижамная вечеринка", tint: "#f0e6dc" },
  { id: "buffet", label: "фуршет", tint: "#ebe4d8" },
  { id: "forest-trail", label: "лесная тропа", tint: "#4a6b4a" },
  { id: "winter-forest", label: "зимний лес", tint: "#c8d4dc" },
  { id: "gym", label: "тренажёрный зал", tint: "#5a5a62" },
  { id: "school", label: "школа", tint: "#c4b8a8" },
  { id: "sports", label: "спортивная площадка", tint: "#7a9a6a" },
  { id: "winter-street", label: "зимняя улица", tint: "#9aacbc" },
];

export const defaultAnimatePoseTiles: ConfigTile[] = [
  { id: "pose-v1", label: "позирует v1", image: animate1 },
  { id: "dance-v1", label: "танец V1", image: animate2 },
  { id: "dance-v2", label: "танец v2", image: animate3 },
  { id: "spin", label: "кружится вокруг своей оси", image: animate4 },
  { id: "pose-v2", label: "позирует v2", image: animate5 },
  { id: "pose-v3", label: "позирует v3", image: animate3 },
  { id: "pose-v1b", label: "позирует v1", image: animate1 },
  { id: "dance-v1b", label: "танец V1", image: animate2 },
  { id: "dance-v2b", label: "танец v2", image: animate4 },
  { id: "spin-b", label: "кружится вокруг своей оси", image: animate5 },
  { id: "pose-v2b", label: "позирует v2", image: animate3 },
  { id: "dance-3", label: "танец 3", image: animate2 },
];
