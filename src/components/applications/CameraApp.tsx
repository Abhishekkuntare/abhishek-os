
// import React, {
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// import { useOS } from "../../context/OSContext";
// import { createVFSFile } from "../../lib/vfs";
// import { checkAndUnlockAchievement } from "../../lib/achievements";

// import {
//   Camera,
//   Video,
//   RefreshCw,
//   Clock3,
//   Download,
//   Trash2,
//   Image as ImageIcon,
//   Check,
//   AlertCircle,
//   Square,
//   Play,
//   Pause,
//   Music2,
//   Smile,
//   Type,
//   Sparkles,
//   Eye,
//   EyeOff,
//   X,
//   Plus,
//   RotateCcw,
//   Volume2,
//   VolumeX,
//   Wand2,
//   Heart,
//   Ghost,
//   Dog,
//   Crown,
//   Glasses,
//   Upload,
//   ChevronDown,
//   Maximize2,
// } from "lucide-react";

// /* =========================================================
//    TYPES
// ========================================================= */

// type CameraMode = "photo" | "video";

// type FilterId =
//   | "normal"
//   | "mono"
//   | "vivid"
//   | "cyber"
//   | "horror"
//   | "cartoon"
//   | "pixel";

// type ToolPanel = "filters" | "stickers" | "text" | "music" | null;

// type OverlayType = "sticker" | "text";

// interface OverlayItem {
//   id: string;
//   type: OverlayType;

//   x: number;
//   y: number;

//   scale: number;
//   rotation: number;

//   value?: string;
//   text?: string;

//   fontSize?: number;
//   color?: string;

//   emoji?: string;
//   label?: string;
// }

// interface MusicTrack {
//   id: string;
//   name: string;
//   type: "generated" | "local";
//   url?: string;
// }

// /* =========================================================
//    CONSTANTS
// ========================================================= */

// const FILTERS: {
//   id: FilterId;
//   name: string;
//   preview: string;
//   css: string;
//   canvas: string;
// }[] = [
//   {
//     id: "normal",
//     name: "Original",
//     preview: "Normal",
//     css: "none",
//     canvas: "none",
//   },
//   {
//     id: "mono",
//     name: "Mono",
//     preview: "B&W",
//     css: "grayscale(1)",
//     canvas: "grayscale(100%)",
//   },
//   {
//     id: "vivid",
//     name: "Vivid",
//     preview: "Bright",
//     css: "contrast(1.25) saturate(1.35) brightness(1.08)",
//     canvas: "contrast(125%) saturate(135%) brightness(108%)",
//   },
//   {
//     id: "cyber",
//     name: "Cyber",
//     preview: "Cyber",
//     css: "hue-rotate(165deg) saturate(1.7) contrast(1.15)",
//     canvas: "hue-rotate(165deg) saturate(170%) contrast(115%)",
//   },
//   {
//     id: "horror",
//     name: "Horror",
//     preview: "Dark",
//     css: "contrast(1.4) saturate(0.65) brightness(0.72) sepia(0.18)",
//     canvas: "contrast(140%) saturate(65%) brightness(72%) sepia(18%)",
//   },
//   {
//     id: "cartoon",
//     name: "Cartoon",
//     preview: "Pop",
//     css: "contrast(1.45) saturate(1.65) brightness(1.05)",
//     canvas: "contrast(145%) saturate(165%) brightness(105%)",
//   },
//   {
//     id: "pixel",
//     name: "Pixel",
//     preview: "Retro",
//     css: "contrast(1.7) saturate(1.8)",
//     canvas: "contrast(170%) saturate(180%)",
//   },
// ];

// const STICKERS = [
//   {
//     id: "dog",
//     label: "Dog",
//     emoji: "🐶",
//     category: "Funny",
//   },
//   {
//     id: "dog2",
//     label: "Puppy",
//     emoji: "🐕",
//     category: "Funny",
//   },
//   {
//     id: "sunglasses",
//     label: "Cool",
//     emoji: "😎",
//     category: "Funny",
//   },
//   {
//     id: "crown",
//     label: "Crown",
//     emoji: "👑",
//     category: "Funny",
//   },
//   {
//     id: "heart",
//     label: "Love",
//     emoji: "❤️",
//     category: "Love",
//   },
//   {
//     id: "fire",
//     label: "Fire",
//     emoji: "🔥",
//     category: "Funny",
//   },
//   {
//     id: "ghost",
//     label: "Ghost",
//     emoji: "👻",
//     category: "Horror",
//   },
//   {
//     id: "skull",
//     label: "Skull",
//     emoji: "💀",
//     category: "Horror",
//   },
//   {
//     id: "clown",
//     label: "Clown",
//     emoji: "🤡",
//     category: "Funny",
//   },
//   {
//     id: "robot",
//     label: "Robot",
//     emoji: "🤖",
//     category: "Pixel",
//   },
//   {
//     id: "alien",
//     label: "Alien",
//     emoji: "👽",
//     category: "Pixel",
//   },
//   {
//     id: "star",
//     label: "Star",
//     emoji: "⭐",
//     category: "Funny",
//   },
//   {
//     id: "sparkles",
//     label: "Sparkles",
//     emoji: "✨",
//     category: "Funny",
//   },
//   {
//     id: "heart-eyes",
//     label: "Love Eyes",
//     emoji: "😍",
//     category: "Love",
//   },
// ];

// const QUOTES = [
//   "Good vibes only ✨",
//   "Stay focused 🚀",
//   "Dream. Build. Repeat.",
//   "Main character energy 😎",
//   "No limits.",
//   "Work hard. Stay humble.",
//   "Built different.",
//   "Create your own future.",
// ];

// /* =========================================================
//    HELPERS
// ========================================================= */

// const createId = (prefix = "item") =>
//   `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// const formatTime = (seconds: number) => {
//   const mins = Math.floor(seconds / 60);
//   const secs = seconds % 60;

//   return `${String(mins).padStart(2, "0")}:${String(secs).padStart(
//     2,
//     "0"
//   )}`;
// };

// const getSupportedMimeType = () => {
//   if (typeof MediaRecorder === "undefined") {
//     return "";
//   }

//   const candidates = [
//     "video/webm;codecs=vp9,opus",
//     "video/webm;codecs=vp8,opus",
//     "video/webm",
//   ];

//   return (
//     candidates.find((type) => MediaRecorder.isTypeSupported(type)) || ""
//   );
// };

// const getCanvasFilter = (filterId: FilterId) => {
//   return (
//     FILTERS.find((filter) => filter.id === filterId)?.canvas || "none"
//   );
// };

// /* =========================================================
//    COMPONENT
// ========================================================= */

// export const CameraApp: React.FC = () => {
//   const { openApp, updateSettings } = useOS();

//   /* -------------------------------------------------------
//      VIDEO / CAMERA
//   ------------------------------------------------------- */

//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const previewRef = useRef<HTMLDivElement>(null);

//   const streamRef = useRef<MediaStream | null>(null);

//   const [stream, setStream] = useState<MediaStream | null>(null);

//   const [cameraError, setCameraError] = useState<string | null>(
//     null
//   );

//   const [facingMode, setFacingMode] = useState<
//     "user" | "environment"
//   >("user");

//   const [mode, setMode] = useState<CameraMode>("photo");

//   /* -------------------------------------------------------
//      FILTER
//   ------------------------------------------------------- */

//   const [filter, setFilter] = useState<FilterId>("normal");

//   /* -------------------------------------------------------
//      TIMER
//   ------------------------------------------------------- */

//   const [timerSeconds, setTimerSeconds] = useState(0);
//   const [countdown, setCountdown] = useState<number | null>(null);

//   /* -------------------------------------------------------
//      CAPTURED MEDIA
//   ------------------------------------------------------- */

//   const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<
//     string | null
//   >(null);

//   const [capturedVideoUrl, setCapturedVideoUrl] = useState<
//     string | null
//   >(null);

//   const [saveStatusText, setSaveStatusText] = useState("");

//   const [isSaved, setIsSaved] = useState(false);

//   /* -------------------------------------------------------
//      RECORDING
//   ------------------------------------------------------- */

//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);

//   const recordedChunksRef = useRef<Blob[]>([]);

//   const [isRecording, setIsRecording] = useState(false);

//   const [isPaused, setIsPaused] = useState(false);

//   const [recordDuration, setRecordDuration] = useState(0);

//   const recordAnimationRef = useRef<number | null>(null);

//   /* -------------------------------------------------------
//      UI
//   ------------------------------------------------------- */

//   const [activePanel, setActivePanel] =
//     useState<ToolPanel>(null);

//   const [toolsHidden, setToolsHidden] = useState(false);

//   const [flashActive, setFlashActive] = useState(false);

//   /* -------------------------------------------------------
//      OVERLAYS
//   ------------------------------------------------------- */

//   const [overlays, setOverlays] = useState<OverlayItem[]>([]);

//   /* -------------------------------------------------------
//      DRAGGING
//   ------------------------------------------------------- */

//   const draggingRef = useRef<{
//     id: string;
//     offsetX: number;
//     offsetY: number;
//   } | null>(null);

//   /* -------------------------------------------------------
//      TEXT
//   ------------------------------------------------------- */

//   const [textInput, setTextInput] = useState("");

//   /* -------------------------------------------------------
//      MUSIC
//   ------------------------------------------------------- */

//   const audioContextRef = useRef<AudioContext | null>(null);

//   const musicDestinationRef =
//     useRef<MediaStreamAudioDestinationNode | null>(null);

//   const micSourceRef =
//     useRef<MediaStreamAudioSourceNode | null>(null);

//   const musicGainRef = useRef<GainNode | null>(null);

//   const musicTimerRef = useRef<number | null>(null);

//   const musicOscillatorsRef = useRef<OscillatorNode[]>([]);

//   const localAudioRef = useRef<HTMLAudioElement | null>(null);

//   const [musicEnabled, setMusicEnabled] = useState(false);

//   const [selectedMusic, setSelectedMusic] = useState<string | null>(
//     null
//   );

//   const [localMusicName, setLocalMusicName] = useState<string | null>(
//     null
//   );

//   /* =========================================================
//      CAMERA START
//   ========================================================= */

//   const stopCamera = useCallback(() => {
//     const currentStream = streamRef.current;

//     if (currentStream) {
//       currentStream.getTracks().forEach((track) => track.stop());
//     }

//     streamRef.current = null;
//     setStream(null);
//   }, []);

//   const startCamera = useCallback(
//     async (facing: "user" | "environment") => {
//       try {
//         setCameraError(null);

//         stopCamera();

//         if (
//           !navigator.mediaDevices ||
//           !navigator.mediaDevices.getUserMedia
//         ) {
//           setCameraError(
//             "Camera access is not supported in this browser."
//           );

//           return;
//         }

//         const newStream =
//           await navigator.mediaDevices.getUserMedia({
//             video: {
//               facingMode: {
//                 ideal: facing,
//               },
//               width: {
//                 ideal: 1920,
//               },
//               height: {
//                 ideal: 1080,
//               },
//               frameRate: {
//                 ideal: 30,
//                 max: 60,
//               },
//             },
//             audio: mode === "video",
//           });

//         streamRef.current = newStream;

//         setStream(newStream);

//         if (videoRef.current) {
//           videoRef.current.srcObject = newStream;

//           try {
//             await videoRef.current.play();
//           } catch {
//             // Browser may wait for user interaction.
//           }
//         }
//       } catch (error: any) {
//         console.error("Camera error:", error);

//         if (
//           error?.name === "NotAllowedError" ||
//           error?.name === "PermissionDeniedError"
//         ) {
//           setCameraError(
//             "Camera permission was denied. Allow camera access in your browser settings."
//           );
//         } else if (
//           error?.name === "NotFoundError" ||
//           error?.name === "DevicesNotFoundError"
//         ) {
//           setCameraError(
//             "No camera device was found on this computer."
//           );
//         } else if (error?.name === "NotReadableError") {
//           setCameraError(
//             "The camera is already being used by another application."
//           );
//         } else {
//           setCameraError(
//             error?.message ||
//               "Unable to start the camera."
//           );
//         }
//       }
//     },
//     [mode, stopCamera]
//   );

//   useEffect(() => {
//     startCamera(facingMode);

//     return () => {
//       stopCamera();
//     };
//   }, [facingMode, mode]);

//   /* =========================================================
//      RECORD TIMER
//   ========================================================= */

//   useEffect(() => {
//     let interval: number | null = null;

//     if (isRecording && !isPaused) {
//       interval = window.setInterval(() => {
//         setRecordDuration((previous) => previous + 1);
//       }, 1000);
//     }

//     return () => {
//       if (interval) {
//         window.clearInterval(interval);
//       }
//     };
//   }, [isRecording, isPaused]);

//   /* =========================================================
//      MUSIC ENGINE
//   ========================================================= */

//   const stopMusic = useCallback(() => {
//     if (musicTimerRef.current) {
//       window.clearInterval(musicTimerRef.current);
//       musicTimerRef.current = null;
//     }

//     musicOscillatorsRef.current.forEach((oscillator) => {
//       try {
//         oscillator.stop();
//       } catch {
//         // already stopped
//       }
//     });

//     musicOscillatorsRef.current = [];

//     if (localAudioRef.current) {
//       localAudioRef.current.pause();
//       localAudioRef.current.currentTime = 0;
//     }

//     setMusicEnabled(false);
//     setSelectedMusic(null);
//   }, []);

//   const ensureAudioContext = () => {
//     if (audioContextRef.current) {
//       return audioContextRef.current;
//     }

//     const AudioContextClass =
//       window.AudioContext ||
//       (window as any).webkitAudioContext;

//     if (!AudioContextClass) {
//       return null;
//     }

//     const context = new AudioContextClass();

//     audioContextRef.current = context;

//     const destination =
//       context.createMediaStreamDestination();

//     musicDestinationRef.current = destination;

//     const gain = context.createGain();

//     gain.gain.value = 0.22;

//     gain.connect(destination);
//     gain.connect(context.destination);

//     musicGainRef.current = gain;

//     return context;
//   };

//   const playGeneratedMusic = async (
//     trackId: string
//   ) => {
//     const context = ensureAudioContext();

//     if (!context || !musicGainRef.current) {
//       return;
//     }

//     if (context.state === "suspended") {
//       await context.resume();
//     }

//     stopMusic();

//     setSelectedMusic(trackId);
//     setMusicEnabled(true);

//     const tracks: Record<
//       string,
//       {
//         notes: number[];
//         tempo: number;
//         wave: OscillatorType;
//       }
//     > = {
//       chill: {
//         notes: [261.63, 329.63, 392, 329.63],
//         tempo: 550,
//         wave: "sine",
//       },
//       cyber: {
//         notes: [220, 277.18, 329.63, 440],
//         tempo: 300,
//         wave: "square",
//       },
//       funny: {
//         notes: [523.25, 659.25, 783.99, 659.25],
//         tempo: 230,
//         wave: "triangle",
//       },
//       horror: {
//         notes: [110, 116.54, 123.47, 98],
//         tempo: 700,
//         wave: "sawtooth",
//       },
//     };

//     const track =
//       tracks[trackId] || tracks.chill;

//     let index = 0;

//     const playNote = () => {
//       const oscillator = context.createOscillator();
//       const gain = context.createGain();

//       oscillator.type = track.wave;

//       oscillator.frequency.value =
//         track.notes[index % track.notes.length];

//       gain.gain.setValueAtTime(
//         0.0001,
//         context.currentTime
//       );

//       gain.gain.exponentialRampToValueAtTime(
//         0.35,
//         context.currentTime + 0.02
//       );

//       gain.gain.exponentialRampToValueAtTime(
//         0.0001,
//         context.currentTime + 0.35
//       );

//       oscillator.connect(gain);

//       gain.connect(musicGainRef.current!);

//       oscillator.start();

//       oscillator.stop(context.currentTime + 0.4);

//       musicOscillatorsRef.current.push(oscillator);

//       index++;
//     };

//     playNote();

//     musicTimerRef.current = window.setInterval(
//       playNote,
//       track.tempo
//     );
//   };

//   const handleLocalMusic = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = event.target.files?.[0];

//     if (!file) {
//       return;
//     }

//     const context = ensureAudioContext();

//     if (!context || !musicDestinationRef.current) {
//       return;
//     }

//     if (context.state === "suspended") {
//       await context.resume();
//     }

//     stopMusic();

//     const url = URL.createObjectURL(file);

//     const audio = new Audio(url);

//     audio.loop = true;
//     audio.volume = 0.35;
//     audio.crossOrigin = "anonymous";

//     const source =
//       context.createMediaElementSource(audio);

//     source.connect(
//       musicDestinationRef.current
//     );

//     source.connect(context.destination);

//     localAudioRef.current = audio;

//     setLocalMusicName(file.name);
//     setSelectedMusic("local");
//     setMusicEnabled(true);

//     await audio.play();
//   };

//   /* =========================================================
//      AUDIO MIX FOR RECORDING
//   ========================================================= */

//   const createRecordingAudioStream = async () => {
//     const currentStream = streamRef.current;

//     if (!currentStream) {
//       return null;
//     }

//     const audioTracks = currentStream.getAudioTracks();

//     if (!musicEnabled || !musicDestinationRef.current) {
//       return audioTracks.length
//         ? new MediaStream(audioTracks)
//         : null;
//     }

//     const context = ensureAudioContext();

//     if (!context || !musicDestinationRef.current) {
//       return audioTracks.length
//         ? new MediaStream(audioTracks)
//         : null;
//     }

//     try {
//       if (!micSourceRef.current && audioTracks.length) {
//         const micStream = new MediaStream(audioTracks);

//         micSourceRef.current =
//           context.createMediaStreamSource(
//             micStream
//           );

//         micSourceRef.current.connect(
//           musicDestinationRef.current
//         );
//       }
//     } catch (error) {
//       console.warn(
//         "Could not mix microphone audio:",
//         error
//       );
//     }

//     return musicDestinationRef.current.stream;
//   };

//   /* =========================================================
//      OVERLAYS
//   ========================================================= */

//   const addSticker = (sticker: (typeof STICKERS)[number]) => {
//     const overlay: OverlayItem = {
//       id: createId("sticker"),
//       type: "sticker",
//       x: 50,
//       y: 45,
//       scale: 1,
//       rotation: 0,
//       emoji: sticker.emoji,
//       label: sticker.label,
//     };

//     setOverlays((previous) => [
//       ...previous,
//       overlay,
//     ]);
//   };

//   const addText = (text: string) => {
//     const cleanText = text.trim();

//     if (!cleanText) {
//       return;
//     }

//     const overlay: OverlayItem = {
//       id: createId("text"),
//       type: "text",
//       x: 50,
//       y: 50,
//       scale: 1,
//       rotation: 0,
//       text: cleanText,
//       fontSize: 34,
//       color: "#ffffff",
//     };

//     setOverlays((previous) => [
//       ...previous,
//       overlay,
//     ]);

//     setTextInput("");
//   };

//   const removeOverlay = (id: string) => {
//     setOverlays((previous) =>
//       previous.filter((item) => item.id !== id)
//     );
//   };

//   const clearOverlays = () => {
//     setOverlays([]);
//   };

//   const updateOverlay = (
//     id: string,
//     updates: Partial<OverlayItem>
//   ) => {
//     setOverlays((previous) =>
//       previous.map((item) =>
//         item.id === id
//           ? {
//               ...item,
//               ...updates,
//             }
//           : item
//       )
//     );
//   };

//   /* =========================================================
//      DRAG OVERLAYS
//   ========================================================= */

//   const handleOverlayPointerDown = (
//     event: React.PointerEvent,
//     item: OverlayItem
//   ) => {
//     event.preventDefault();
//     event.stopPropagation();

//     const container =
//       previewRef.current;

//     if (!container) {
//       return;
//     }

//     const rect =
//       container.getBoundingClientRect();

//     const pointerX =
//       ((event.clientX - rect.left) /
//         rect.width) *
//       100;

//     const pointerY =
//       ((event.clientY - rect.top) /
//         rect.height) *
//       100;

//     draggingRef.current = {
//       id: item.id,
//       offsetX: pointerX - item.x,
//       offsetY: pointerY - item.y,
//     };

//     (
//       event.currentTarget as HTMLElement
//     ).setPointerCapture(event.pointerId);
//   };

//   const handleOverlayPointerMove = (
//     event: React.PointerEvent
//   ) => {
//     const dragging = draggingRef.current;

//     if (!dragging) {
//       return;
//     }

//     const container =
//       previewRef.current;

//     if (!container) {
//       return;
//     }

//     const rect =
//       container.getBoundingClientRect();

//     let x =
//       ((event.clientX - rect.left) /
//         rect.width) *
//         100 -
//       dragging.offsetX;

//     let y =
//       ((event.clientY - rect.top) /
//         rect.height) *
//         100 -
//       dragging.offsetY;

//     x = Math.max(4, Math.min(96, x));
//     y = Math.max(6, Math.min(94, y));

//     updateOverlay(dragging.id, {
//       x,
//       y,
//     });
//   };

//   const handleOverlayPointerUp = () => {
//     draggingRef.current = null;
//   };

//   /* =========================================================
//      CANVAS RENDERING
//   ========================================================= */

//   const drawFrameToCanvas = useCallback(
//     (
//       video: HTMLVideoElement,
//       canvas: HTMLCanvasElement
//     ) => {
//       if (!video.videoWidth || !video.videoHeight) {
//         return;
//       }

//       const ctx =
//         canvas.getContext("2d");

//       if (!ctx) {
//         return;
//       }

//       const width = video.videoWidth;
//       const height = video.videoHeight;

//       if (
//         canvas.width !== width ||
//         canvas.height !== height
//       ) {
//         canvas.width = width;
//         canvas.height = height;
//       }

//       ctx.clearRect(
//         0,
//         0,
//         width,
//         height
//       );

//       ctx.save();

//       ctx.filter =
//         getCanvasFilter(filter);

//       if (facingMode === "user") {
//         ctx.translate(width, 0);
//         ctx.scale(-1, 1);
//       }

//       ctx.drawImage(
//         video,
//         0,
//         0,
//         width,
//         height
//       );

//       ctx.restore();

//       /* ---------------------------------------------
//          OVERLAYS
//       --------------------------------------------- */

//       overlays.forEach((overlay) => {
//         const x =
//           (overlay.x / 100) * width;

//         const y =
//           (overlay.y / 100) * height;

//         ctx.save();

//         ctx.translate(x, y);

//         ctx.rotate(
//           ((overlay.rotation || 0) *
//             Math.PI) /
//             180
//         );

//         ctx.scale(
//           overlay.scale || 1,
//           overlay.scale || 1
//         );

//         if (
//           overlay.type === "sticker"
//         ) {
//           ctx.font = `${Math.max(
//             30,
//             Math.min(
//               width,
//               height
//             ) * 0.09
//           )}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;

//           ctx.textAlign = "center";
//           ctx.textBaseline = "middle";

//           ctx.fillText(
//             overlay.emoji || "✨",
//             0,
//             0
//           );
//         }

//         if (
//           overlay.type === "text"
//         ) {
//           ctx.font = `800 ${
//             overlay.fontSize || 34
//           }px Arial, sans-serif`;

//           ctx.textAlign = "center";
//           ctx.textBaseline = "middle";

//           ctx.lineWidth = 7;
//           ctx.strokeStyle =
//             "rgba(0,0,0,0.75)";

//           ctx.strokeText(
//             overlay.text || "",
//             0,
//             0
//           );

//           ctx.fillStyle =
//             overlay.color || "#ffffff";

//           ctx.fillText(
//             overlay.text || "",
//             0,
//             0
//           );
//         }

//         ctx.restore();
//       });
//     },
//     [
//       facingMode,
//       filter,
//       overlays,
//     ]
//   );

//   /* =========================================================
//      PHOTO CAPTURE
//   ========================================================= */

//   const executeCapture = async () => {
//     const video =
//       videoRef.current;

//     const canvas =
//       canvasRef.current;

//     if (
//       !video ||
//       !canvas ||
//       !video.videoWidth
//     ) {
//       return;
//     }

//     setFlashActive(true);

//     window.setTimeout(() => {
//       setFlashActive(false);
//     }, 160);

//     drawFrameToCanvas(
//       video,
//       canvas
//     );

//     const dataUrl =
//       canvas.toDataURL(
//         "image/jpeg",
//         0.94
//       );

//     setCapturedPhotoUrl(dataUrl);
//     setCapturedVideoUrl(null);
//     setIsSaved(false);

//     /* AUTO SAVE */

//     try {
//       const fileName = `IMG_${Date.now()}.jpg`;

//       await createVFSFile(
//         "/Pictures",
//         fileName,
//         dataUrl,
//         "jpg",
//         "image/jpeg"
//       );

//       setIsSaved(true);

//       setSaveStatusText(
//         `Saved automatically to /Pictures/${fileName}`
//       );

//       checkAndUnlockAchievement(
//         "camera-shutter"
//       );
//     } catch (error) {
//       console.error(
//         "Photo save error:",
//         error
//       );

//       setSaveStatusText(
//         "Photo captured, but automatic save failed."
//       );
//     }
//   };

//   const handleTriggerPhoto = () => {
//     if (!streamRef.current) {
//       return;
//     }

//     if (timerSeconds <= 0) {
//       executeCapture();
//       return;
//     }

//     setCountdown(timerSeconds);

//     let remaining = timerSeconds;

//     const interval =
//       window.setInterval(() => {
//         remaining -= 1;

//         if (remaining <= 0) {
//           window.clearInterval(interval);

//           setCountdown(null);

//           executeCapture();
//         } else {
//           setCountdown(remaining);
//         }
//       }, 1000);
//   };

//   /* =========================================================
//      VIDEO RECORDING
//   ========================================================= */

//   const startRecording = async () => {
//     const video =
//       videoRef.current;

//     if (!video || !streamRef.current) {
//       return;
//     }

//     const canvas =
//       canvasRef.current;

//     if (!canvas) {
//       return;
//     }

//     drawFrameToCanvas(
//       video,
//       canvas
//     );

//     if (
//       typeof canvas.captureStream !==
//       "function"
//     ) {
//       setSaveStatusText(
//         "Video recording is not supported by this browser."
//       );

//       return;
//     }

//     const canvasStream =
//       canvas.captureStream(30);

//     const audioStream =
//       await createRecordingAudioStream();

//     const finalStream =
//       new MediaStream();

//     canvasStream
//       .getVideoTracks()
//       .forEach((track) => {
//         finalStream.addTrack(track);
//       });

//     if (audioStream) {
//       audioStream
//         .getAudioTracks()
//         .forEach((track) => {
//           finalStream.addTrack(track);
//         });
//     }

//     const mimeType =
//       getSupportedMimeType();

//     let recorder: MediaRecorder;

//     try {
//       recorder = mimeType
//         ? new MediaRecorder(
//             finalStream,
//             {
//               mimeType,
//             }
//           )
//         : new MediaRecorder(
//             finalStream
//           );
//     } catch (error) {
//       console.error(
//         "MediaRecorder error:",
//         error
//       );

//       setSaveStatusText(
//         "This browser cannot start video recording."
//       );

//       return;
//     }

//     recordedChunksRef.current = [];

//     recorder.ondataavailable = (
//       event
//     ) => {
//       if (event.data.size > 0) {
//         recordedChunksRef.current.push(
//           event.data
//         );
//       }
//     };

//     recorder.onerror = (event) => {
//       console.error(
//         "Recorder error:",
//         event
//       );

//       setSaveStatusText(
//         "Recording error occurred."
//       );
//     };

//     recorder.onstop = async () => {
//       if (
//         recordAnimationRef.current
//       ) {
//         cancelAnimationFrame(
//           recordAnimationRef.current
//         );

//         recordAnimationRef.current =
//           null;
//       }

//       const blob = new Blob(
//         recordedChunksRef.current,
//         {
//           type:
//             mimeType ||
//             "video/webm",
//         }
//       );

//       if (!blob.size) {
//         setSaveStatusText(
//           "No video data was captured."
//         );

//         return;
//       }

//       const url =
//         URL.createObjectURL(blob);

//       setCapturedVideoUrl(url);
//       setCapturedPhotoUrl(null);

//       setIsSaved(false);

//       /* AUTO SAVE VIDEO */

//       try {
//         const reader =
//           new FileReader();

//         reader.onloadend = async () => {
//           try {
//             const base64 =
//               reader.result as string;

//             const fileName = `VID_${Date.now()}.webm`;

//             await createVFSFile(
//               "/Videos",
//               fileName,
//               base64,
//               "webm",
//               "video/webm"
//             );

//             setIsSaved(true);

//             setSaveStatusText(
//               `Video saved automatically to /Videos/${fileName}`
//             );
//           } catch (error) {
//             console.error(
//               "Video VFS save error:",
//               error
//             );

//             setSaveStatusText(
//               "Video recorded, but automatic save failed."
//             );
//           }
//         };

//         reader.readAsDataURL(blob);
//       } catch (error) {
//         console.error(
//           "Video FileReader error:",
//           error
//         );
//       }

//       /* Stop generated canvas tracks */

//       canvasStream
//         .getTracks()
//         .forEach((track) => {
//           track.stop();
//         });

//       setIsRecording(false);
//       setIsPaused(false);
//     };

//     mediaRecorderRef.current =
//       recorder;

//     recorder.start(500);

//     setIsRecording(true);
//     setIsPaused(false);
//     setRecordDuration(0);

//     /* ---------------------------------------------
//        CONTINUOUS CANVAS COMPOSITING
//     --------------------------------------------- */

//     const renderRecordingFrame = () => {
//       if (
//         mediaRecorderRef.current &&
//         mediaRecorderRef.current.state !==
//           "inactive"
//       ) {
//         drawFrameToCanvas(
//           video,
//           canvas
//         );

//         recordAnimationRef.current =
//           requestAnimationFrame(
//             renderRecordingFrame
//           );
//       }
//     };

//     renderRecordingFrame();
//   };

//   const stopRecording = () => {
//     const recorder =
//       mediaRecorderRef.current;

//     if (
//       recorder &&
//       recorder.state !== "inactive"
//     ) {
//       recorder.stop();
//     }
//   };

//   const pauseRecording = () => {
//     const recorder =
//       mediaRecorderRef.current;

//     if (!recorder) {
//       return;
//     }

//     if (
//       recorder.state === "recording"
//     ) {
//       recorder.pause();
//       setIsPaused(true);
//     } else if (
//       recorder.state === "paused"
//     ) {
//       recorder.resume();
//       setIsPaused(false);
//     }
//   };

//   /* =========================================================
//      WALLPAPER
//   ========================================================= */

//   const handleSetWallpaper = () => {
//     if (!capturedPhotoUrl) {
//       return;
//     }

//     updateSettings({
//       wallpaperId: "custom-photo",
//     });

//     window.dispatchEvent(
//       new CustomEvent(
//         "abhishek:set-custom-wallpaper",
//         {
//           detail: {
//             dataUrl: capturedPhotoUrl,
//           },
//         }
//       )
//     );

//     setSaveStatusText(
//       "Photo sent to desktop wallpaper."
//     );
//   };

//   /* =========================================================
//      MODE SWITCH
//   ========================================================= */

//   const switchMode = (
//     nextMode: CameraMode
//   ) => {
//     if (isRecording) {
//       stopRecording();
//     }

//     setMode(nextMode);

//     setCapturedPhotoUrl(null);
//     setCapturedVideoUrl(null);

//     setSaveStatusText("");
//   };

//   /* =========================================================
//      CAMERA SWITCH
//   ========================================================= */

//   const switchCamera = () => {
//     if (isRecording) {
//       return;
//     }

//     setFacingMode((previous) =>
//       previous === "user"
//         ? "environment"
//         : "user"
//     );
//   };

//   /* =========================================================
//      TIMER
//   ========================================================= */

//   const cycleTimer = () => {
//     setTimerSeconds((previous) => {
//       if (previous === 0) return 3;
//       if (previous === 3) return 5;
//       return 0;
//     });
//   };

//   /* =========================================================
//      RESET CAPTURE
//   ========================================================= */

//   const resetCapture = () => {
//     setCapturedPhotoUrl(null);
//     setCapturedVideoUrl(null);
//     setIsSaved(false);
//     setSaveStatusText("");
//   };

//   /* =========================================================
//      CLEANUP
//   ========================================================= */

//   useEffect(() => {
//     return () => {
//       stopCamera();

//       stopMusic();

//       if (
//         capturedVideoUrl
//       ) {
//         URL.revokeObjectURL(
//           capturedVideoUrl
//         );
//       }

//       if (
//         localAudioRef.current
//       ) {
//         localAudioRef.current.pause();
//       }

//       if (
//         audioContextRef.current
//       ) {
//         audioContextRef.current.close();
//       }
//     };
//   }, []);

//   /* =========================================================
//      UI
//   ========================================================= */

//   const selectedFilter =
//     FILTERS.find(
//       (item) => item.id === filter
//     );

//   return (
//     <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-black text-white font-sans select-none">
//       {/* =====================================================
//           TOP BAR
//       ===================================================== */}

//       <header className="relative z-50 flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-slate-950/90 px-3 backdrop-blur-xl">
//         <div className="flex min-w-0 items-center gap-3">
//           {/* Status */}

//           <div className="hidden items-center gap-2 sm:flex">
//             <span
//               className={`h-2.5 w-2.5 rounded-full ${
//                 stream
//                   ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]"
//                   : "bg-red-500"
//               }`}
//             />

//             <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
//               {stream
//                 ? "Camera Ready"
//                 : "Offline"}
//             </span>
//           </div>

//           {/* Mode */}

//           <div className="flex rounded-xl border border-white/10 bg-white/5 p-1">
//             <button
//               onClick={() =>
//                 switchMode("photo")
//               }
//               className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
//                 mode === "photo"
//                   ? "bg-sky-500 text-white shadow-lg"
//                   : "text-slate-400 hover:bg-white/10 hover:text-white"
//               }`}
//             >
//               <Camera className="h-3.5 w-3.5" />
//               Photo
//             </button>

//             <button
//               onClick={() =>
//                 switchMode("video")
//               }
//               className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
//                 mode === "video"
//                   ? "bg-rose-500 text-white shadow-lg"
//                   : "text-slate-400 hover:bg-white/10 hover:text-white"
//               }`}
//             >
//               <Video className="h-3.5 w-3.5" />
//               Video
//             </button>
//           </div>
//         </div>

//         {/* RIGHT CONTROLS */}

//         <div className="flex items-center gap-1.5">
//           {/* Filter */}

//           <button
//             onClick={() =>
//               setActivePanel(
//                 activePanel === "filters"
//                   ? null
//                   : "filters"
//               )
//             }
//             className={`rounded-xl p-2.5 transition ${
//               activePanel === "filters"
//                 ? "bg-sky-500 text-white"
//                 : "bg-white/5 text-slate-300 hover:bg-white/10"
//             }`}
//             title="Filters"
//           >
//             <Wand2 className="h-4 w-4" />
//           </button>

//           {/* Stickers */}

//           <button
//             onClick={() =>
//               setActivePanel(
//                 activePanel === "stickers"
//                   ? null
//                   : "stickers"
//               )
//             }
//             className={`rounded-xl p-2.5 transition ${
//               activePanel === "stickers"
//                 ? "bg-purple-500 text-white"
//                 : "bg-white/5 text-slate-300 hover:bg-white/10"
//             }`}
//             title="Stickers"
//           >
//             <Smile className="h-4 w-4" />
//           </button>

//           {/* Text */}

//           <button
//             onClick={() =>
//               setActivePanel(
//                 activePanel === "text"
//                   ? null
//                   : "text"
//               )
//             }
//             className={`rounded-xl p-2.5 transition ${
//               activePanel === "text"
//                 ? "bg-pink-500 text-white"
//                 : "bg-white/5 text-slate-300 hover:bg-white/10"
//             }`}
//             title="Text"
//           >
//             <Type className="h-4 w-4" />
//           </button>

//           {/* Music */}

//           <button
//             onClick={() =>
//               setActivePanel(
//                 activePanel === "music"
//                   ? null
//                   : "music"
//               )
//             }
//             className={`rounded-xl p-2.5 transition ${
//               activePanel === "music"
//                 ? "bg-emerald-500 text-white"
//                 : "bg-white/5 text-slate-300 hover:bg-white/10"
//             }`}
//             title="Music"
//           >
//             <Music2 className="h-4 w-4" />
//           </button>

//           {/* Hide / Show */}

//           <button
//             onClick={() =>
//               setToolsHidden(
//                 (previous) => !previous
//               )
//             }
//             className="rounded-xl bg-white/5 p-2.5 text-slate-300 transition hover:bg-white/10"
//             title={
//               toolsHidden
//                 ? "Show controls"
//                 : "Hide controls"
//             }
//           >
//             {toolsHidden ? (
//               <Eye className="h-4 w-4" />
//             ) : (
//               <EyeOff className="h-4 w-4" />
//             )}
//           </button>
//         </div>
//       </header>

//       {/* =====================================================
//           CAMERA VIEW
//       ===================================================== */}

//       <main
//         ref={previewRef}
//         className="relative min-h-0 flex-1 overflow-hidden bg-black"
//         onPointerMove={
//           handleOverlayPointerMove
//         }
//         onPointerUp={
//           handleOverlayPointerUp
//         }
//         onPointerCancel={
//           handleOverlayPointerUp
//         }
//       >
//         {/* Camera */}

//         <video
//           ref={videoRef}
//           autoPlay
//           muted
//           playsInline
//           className={`absolute inset-0 h-full w-full object-cover transition-all duration-300 ${
//             facingMode === "user"
//               ? "-scale-x-100"
//               : ""
//           } ${
//             selectedFilter?.css || ""
//           } ${
//             capturedPhotoUrl ||
//             capturedVideoUrl
//               ? "opacity-0"
//               : "opacity-100"
//           }`}
//         />

//         {/* Camera gradient */}

//         <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

//         {/* Recording HUD */}

//         {isRecording && (
//           <div className="absolute left-4 top-4 z-30 flex items-center gap-2 rounded-full border border-red-300/20 bg-red-600/80 px-3 py-1.5 shadow-xl backdrop-blur-xl">
//             <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />

//             <span className="font-mono text-xs font-bold tracking-widest">
//               {formatTime(
//                 recordDuration
//               )}
//             </span>

//             <span className="text-[10px] uppercase text-red-100">
//               {isPaused
//                 ? "Paused"
//                 : "Recording"}
//             </span>
//           </div>
//         )}

//         {/* Timer */}

//         {countdown !== null && (
//           <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
//             <div className="flex h-32 w-32 items-center justify-center rounded-full border border-sky-400/30 bg-black/40 shadow-[0_0_80px_rgba(14,165,233,0.3)]">
//               <span className="text-7xl font-black text-white">
//                 {countdown}
//               </span>
//             </div>
//           </div>
//         )}

//         {/* Flash */}

//         {flashActive && (
//           <div className="pointer-events-none absolute inset-0 z-[100] bg-white" />
//         )}

//         {/* =================================================
//             DRAGGABLE OVERLAYS
//         ================================================= */}

//         {!capturedPhotoUrl &&
//           !capturedVideoUrl &&
//           overlays.map((overlay) => (
//             <div
//               key={overlay.id}
//               className="absolute z-20 touch-none cursor-grab active:cursor-grabbing"
//               style={{
//                 left: `${overlay.x}%`,
//                 top: `${overlay.y}%`,
//                 transform: `translate(-50%, -50%) rotate(${overlay.rotation}deg) scale(${overlay.scale})`,
//               }}
//               onPointerDown={(event) =>
//                 handleOverlayPointerDown(
//                   event,
//                   overlay
//                 )
//               }
//               onDoubleClick={() =>
//                 removeOverlay(
//                   overlay.id
//                 )
//               }
//             >
//               {overlay.type ===
//                 "sticker" && (
//                 <div className="relative">
//                   <span className="block text-7xl drop-shadow-[0_8px_20px_rgba(0,0,0,0.55)]">
//                     {overlay.emoji}
//                   </span>

//                   <button
//                     onPointerDown={(event) => {
//                       event.stopPropagation();
//                     }}
//                     onClick={() =>
//                       removeOverlay(
//                         overlay.id
//                       )
//                     }
//                     className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white opacity-0 transition hover:bg-red-500 group-hover:opacity-100"
//                   >
//                     <X className="h-3 w-3" />
//                   </button>
//                 </div>
//               )}

//               {overlay.type ===
//                 "text" && (
//                 <div className="relative whitespace-nowrap rounded-lg px-2 py-1 text-center font-black text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
//                   {overlay.text}
//                 </div>
//               )}
//             </div>
//           ))}

//         {/* =================================================
//             CAMERA ERROR
//         ================================================= */}

//         {cameraError && (
//           <div className="absolute inset-0 z-50 flex items-center justify-center p-5">
//             <div className="w-full max-w-md rounded-3xl border border-red-400/20 bg-slate-950/90 p-7 text-center shadow-2xl backdrop-blur-2xl">
//               <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
//                 <AlertCircle className="h-7 w-7 text-red-400" />
//               </div>

//               <h3 className="text-lg font-bold">
//                 Camera unavailable
//               </h3>

//               <p className="mt-2 text-sm leading-relaxed text-slate-400">
//                 {cameraError}
//               </p>

//               <div className="mt-5 flex justify-center gap-2">
//                 <button
//                   onClick={() =>
//                     startCamera(
//                       facingMode
//                     )
//                   }
//                   className="rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-sky-400"
//                 >
//                   Try Again
//                 </button>

//                 <button
//                   onClick={() =>
//                     openApp("gallery")
//                   }
//                   className="rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/15"
//                 >
//                   Gallery
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* =================================================
//             CAPTURED PHOTO
//         ================================================= */}

//         {capturedPhotoUrl && (
//           <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-slate-950 p-4">
//             <div className="relative max-h-[70%] max-w-[90%] overflow-hidden rounded-3xl border border-white/15 bg-black shadow-2xl">
//               <img
//                 src={capturedPhotoUrl}
//                 alt="Captured"
//                 className="max-h-[60vh] max-w-full object-contain"
//               />
//             </div>

//             <div className="mt-5 flex max-w-2xl flex-wrap items-center justify-center gap-2">
//               <button
//                 onClick={handleSetWallpaper}
//                 className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-bold transition hover:bg-sky-400"
//               >
//                 <Sparkles className="h-4 w-4" />
//                 Wallpaper
//               </button>

//               <a
//                 href={capturedPhotoUrl}
//                 download={`IMG_${Date.now()}.jpg`}
//                 className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold transition hover:bg-white/15"
//               >
//                 <Download className="h-4 w-4" />
//                 Download
//               </a>

//               <button
//                 onClick={() =>
//                   openApp("gallery")
//                 }
//                 className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold transition hover:bg-white/15"
//               >
//                 <ImageIcon className="h-4 w-4" />
//                 Gallery
//               </button>

//               <button
//                 onClick={resetCapture}
//                 className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-300 transition hover:bg-red-500/20"
//               >
//                 <RotateCcw className="h-4 w-4" />
//                 Retake
//               </button>
//             </div>

//             {saveStatusText && (
//               <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
//                 <Check className="h-4 w-4" />
//                 {saveStatusText}
//               </div>
//             )}
//           </div>
//         )}

//         {/* =================================================
//             CAPTURED VIDEO
//         ================================================= */}

//         {capturedVideoUrl && (
//           <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-slate-950 p-4">
//             <video
//               src={capturedVideoUrl}
//               controls
//               autoPlay
//               playsInline
//               className="max-h-[65%] max-w-[90%] rounded-3xl border border-white/15 bg-black shadow-2xl"
//             />

//             <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
//               <a
//                 href={capturedVideoUrl}
//                 download={`VID_${Date.now()}.webm`}
//                 className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-bold transition hover:bg-sky-400"
//               >
//                 <Download className="h-4 w-4" />
//                 Download
//               </a>

//               <button
//                 onClick={() =>
//                   openApp("gallery")
//                 }
//                 className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold transition hover:bg-white/15"
//               >
//                 <ImageIcon className="h-4 w-4" />
//                 Gallery
//               </button>

//               <button
//                 onClick={resetCapture}
//                 className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-300 transition hover:bg-red-500/20"
//               >
//                 <RotateCcw className="h-4 w-4" />
//                 Record Again
//               </button>
//             </div>

//             {saveStatusText && (
//               <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
//                 <Check className="h-4 w-4" />
//                 {saveStatusText}
//               </div>
//             )}
//           </div>
//         )}

//         {/* =================================================
//             TOOL PANEL
//         ================================================= */}

//         {!toolsHidden &&
//           activePanel && (
//             <div className="absolute bottom-5 left-1/2 z-50 w-[min(94%,720px)] -translate-x-1/2">
//               <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/90 shadow-2xl backdrop-blur-2xl">
//                 {/* PANEL HEADER */}

//                 <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
//                   <div>
//                     <h3 className="text-sm font-bold text-white">
//                       {activePanel ===
//                         "filters" &&
//                         "Lens Filters"}

//                       {activePanel ===
//                         "stickers" &&
//                         "Stickers & Effects"}

//                       {activePanel ===
//                         "text" &&
//                         "Text & Captions"}

//                       {activePanel ===
//                         "music" &&
//                         "Music"}
//                     </h3>

//                     <p className="mt-0.5 text-[10px] text-slate-500">
//                       {activePanel ===
//                         "filters" &&
//                         "Apply a live visual effect"}

//                       {activePanel ===
//                         "stickers" &&
//                         "Drag effects anywhere on screen"}

//                       {activePanel ===
//                         "text" &&
//                         "Add captions and quotes"}

//                       {activePanel ===
//                         "music" &&
//                         "Music will be mixed into video recordings"}
//                     </p>
//                   </div>

//                   <button
//                     onClick={() =>
//                       setActivePanel(null)
//                     }
//                     className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white"
//                   >
//                     <X className="h-4 w-4" />
//                   </button>
//                 </div>

//                 {/* =================================================
//                     FILTERS
//                 ================================================= */}

//                 {activePanel ===
//                   "filters" && (
//                   <div className="grid grid-cols-4 gap-2 p-4 sm:grid-cols-7">
//                     {FILTERS.map(
//                       (item) => (
//                         <button
//                           key={
//                             item.id
//                           }
//                           onClick={() =>
//                             setFilter(
//                               item.id
//                             )
//                           }
//                           className={`group rounded-2xl border p-2 transition ${
//                             filter ===
//                             item.id
//                               ? "border-sky-400 bg-sky-500/15"
//                               : "border-white/5 bg-white/5 hover:bg-white/10"
//                           }`}
//                         >
//                           <div
//                             className="mb-2 aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-slate-700 to-slate-950"
//                             style={{
//                               filter:
//                                 item.css,
//                             }}
//                           >
//                             <div className="flex h-full items-center justify-center text-3xl">
//                               {item.id ===
//                                 "horror"
//                                 ? "👻"
//                                 : item.id ===
//                                   "cartoon"
//                                 ? "🤡"
//                                 : item.id ===
//                                   "pixel"
//                                 ? "👾"
//                                 : item.id ===
//                                   "cyber"
//                                 ? "⚡"
//                                 : "✨"}
//                             </div>
//                           </div>

//                           <div className="text-[10px] font-bold text-slate-300">
//                             {item.name}
//                           </div>
//                         </button>
//                       )
//                     )}
//                   </div>
//                 )}

//                 {/* =================================================
//                     STICKERS
//                 ================================================= */}

//                 {activePanel ===
//                   "stickers" && (
//                   <div className="max-h-64 overflow-y-auto p-4">
//                     <div className="grid grid-cols-5 gap-2 sm:grid-cols-7">
//                       {STICKERS.map(
//                         (sticker) => (
//                           <button
//                             key={
//                               sticker.id
//                             }
//                             onClick={() =>
//                               addSticker(
//                                 sticker
//                               )
//                             }
//                             className="group rounded-2xl border border-white/5 bg-white/5 p-2 transition hover:-translate-y-0.5 hover:border-purple-400/30 hover:bg-purple-500/10"
//                           >
//                             <div className="flex aspect-square items-center justify-center rounded-xl bg-black/20 text-3xl transition group-hover:scale-110">
//                               {
//                                 sticker.emoji
//                               }
//                             </div>

//                             <div className="mt-1 truncate text-[9px] text-slate-400">
//                               {
//                                 sticker.label
//                               }
//                             </div>
//                           </button>
//                         )
//                       )}
//                     </div>

//                     {overlays.length >
//                       0 && (
//                       <button
//                         onClick={
//                           clearOverlays
//                         }
//                         className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/10 bg-red-500/5 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/10"
//                       >
//                         <Trash2 className="h-3.5 w-3.5" />
//                         Remove all overlays
//                       </button>
//                     )}

//                     <p className="mt-3 text-center text-[10px] text-slate-500">
//                       Drag an effect with
//                       your mouse/finger.
//                       Double-click an effect
//                       to remove it.
//                     </p>
//                   </div>
//                 )}

//                 {/* =================================================
//                     TEXT
//                 ================================================= */}

//                 {activePanel ===
//                   "text" && (
//                   <div className="p-4">
//                     <div className="flex gap-2">
//                       <input
//                         value={
//                           textInput
//                         }
//                         onChange={(event) =>
//                           setTextInput(
//                             event.target
//                               .value
//                           )
//                         }
//                         onKeyDown={(
//                           event
//                         ) => {
//                           if (
//                             event.key ===
//                             "Enter"
//                           ) {
//                             addText(
//                               textInput
//                             );
//                           }
//                         }}
//                         placeholder="Write a caption..."
//                         className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-400"
//                       />

//                       <button
//                         onClick={() =>
//                           addText(
//                             textInput
//                           )
//                         }
//                         className="rounded-xl bg-pink-500 px-4 text-white transition hover:bg-pink-400"
//                       >
//                         <Plus className="h-5 w-5" />
//                       </button>
//                     </div>

//                     <div className="mt-3">
//                       <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
//                         Quick captions
//                       </p>

//                       <div className="flex flex-wrap gap-2">
//                         {QUOTES.map(
//                           (quote) => (
//                             <button
//                               key={quote}
//                               onClick={() =>
//                                 addText(
//                                   quote
//                                 )
//                               }
//                               className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] text-slate-300 transition hover:border-pink-400/30 hover:bg-pink-500/10 hover:text-white"
//                             >
//                               {quote}
//                             </button>
//                           )
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* =================================================
//                     MUSIC
//                 ================================================= */}

//                 {activePanel ===
//                   "music" && (
//                   <div className="p-4">
//                     <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
//                       {[
//                         {
//                           id: "chill",
//                           name: "Chill",
//                           icon: "🌙",
//                         },
//                         {
//                           id: "cyber",
//                           name: "Cyber",
//                           icon: "⚡",
//                         },
//                         {
//                           id: "funny",
//                           name: "Funny",
//                           icon: "😂",
//                         },
//                         {
//                           id: "horror",
//                           name: "Horror",
//                           icon: "👻",
//                         },
//                       ].map(
//                         (track) => (
//                           <button
//                             key={
//                               track.id
//                             }
//                             onClick={() =>
//                               playGeneratedMusic(
//                                 track.id
//                               )
//                             }
//                             className={`rounded-2xl border p-3 text-left transition ${
//                               selectedMusic ===
//                               track.id
//                                 ? "border-emerald-400 bg-emerald-500/10"
//                                 : "border-white/5 bg-white/5 hover:bg-white/10"
//                             }`}
//                           >
//                             <div className="text-2xl">
//                               {
//                                 track.icon
//                               }
//                             </div>

//                             <div className="mt-2 text-xs font-bold">
//                               {
//                                 track.name
//                               }
//                             </div>

//                             <div className="mt-0.5 text-[9px] text-slate-500">
//                               Built-in loop
//                             </div>
//                           </button>
//                         )
//                       )}
//                     </div>

//                     <div className="mt-3 flex flex-wrap gap-2">
//                       <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold transition hover:bg-white/10">
//                         <Upload className="h-4 w-4" />
//                         Add local song

//                         <input
//                           type="file"
//                           accept="audio/*"
//                           className="hidden"
//                           onChange={
//                             handleLocalMusic
//                           }
//                         />
//                       </label>

//                       {localMusicName && (
//                         <div className="flex min-w-0 items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
//                           <Music2 className="h-4 w-4 shrink-0" />

//                           <span className="max-w-[220px] truncate">
//                             {
//                               localMusicName
//                             }
//                           </span>
//                         </div>
//                       )}

//                       {musicEnabled ? (
//                         <button
//                           onClick={
//                             stopMusic
//                           }
//                           className="flex items-center gap-2 rounded-xl bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20"
//                         >
//                           <VolumeX className="h-4 w-4" />
//                           Stop music
//                         </button>
//                       ) : (
//                         <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs text-slate-500">
//                           <Volume2 className="h-4 w-4" />
//                           No music
//                         </div>
//                       )}
//                     </div>

//                     <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
//                       Music is mixed into video
//                       recordings. Photos do not
//                       contain audio.
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//       </main>

//       {/* =====================================================
//           BOTTOM BAR
//       ===================================================== */}

//       {!toolsHidden && (
//         <footer className="relative z-50 flex h-[76px] shrink-0 items-center justify-between border-t border-white/10 bg-slate-950/95 px-4 backdrop-blur-xl">
//           {/* Gallery */}

//           <button
//             onClick={() =>
//               openApp("gallery")
//             }
//             className="flex min-w-[90px] items-center gap-2 rounded-xl px-2 py-2 text-left text-slate-400 transition hover:bg-white/5 hover:text-white"
//           >
//             <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10">
//               <ImageIcon className="h-5 w-5 text-sky-400" />
//             </div>

//             <div className="hidden sm:block">
//               <div className="text-[11px] font-bold">
//                 Gallery
//               </div>
//               <div className="text-[9px] text-slate-600">
//                 Pictures & videos
//               </div>
//             </div>
//           </button>

//           {/* CAMERA CONTROL */}

//           <div className="flex items-center gap-3">
//             {/* Timer */}

//             {mode === "photo" && (
//               <button
//                 onClick={cycleTimer}
//                 className={`relative rounded-full p-2.5 transition ${
//                   timerSeconds
//                     ? "bg-amber-500/20 text-amber-300"
//                     : "bg-white/5 text-slate-400 hover:bg-white/10"
//                 }`}
//                 title="Timer"
//               >
//                 <Clock3 className="h-5 w-5" />

//                 {timerSeconds > 0 && (
//                   <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[8px] font-black text-black">
//                     {timerSeconds}
//                   </span>
//                 )}
//               </button>
//             )}

//             {/* Shutter */}

//             {mode === "photo" ? (
//               <button
//                 onClick={
//                   handleTriggerPhoto
//                 }
//                 disabled={
//                   !stream ||
//                   countdown !== null
//                 }
//                 className="group flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_0_35px_rgba(255,255,255,0.25)] transition hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
//               >
//                 <div className="h-12 w-12 rounded-full border-[3px] border-slate-950 bg-white transition group-hover:border-sky-500" />
//               </button>
//             ) : (
//               <>
//                 {!isRecording ? (
//                   <button
//                     onClick={
//                       startRecording
//                     }
//                     disabled={!stream}
//                     className="group flex h-16 w-16 items-center justify-center rounded-full bg-rose-500 shadow-[0_0_35px_rgba(244,63,94,0.35)] transition hover:scale-105 active:scale-95 disabled:opacity-30"
//                   >
//                     <div className="h-6 w-6 rounded-full bg-white" />
//                   </button>
//                 ) : (
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={
//                         pauseRecording
//                       }
//                       className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10"
//                     >
//                       {isPaused ? (
//                         <Play className="h-5 w-5 fill-current" />
//                       ) : (
//                         <Pause className="h-5 w-5 fill-current" />
//                       )}
//                     </button>

//                     <button
//                       onClick={
//                         stopRecording
//                       }
//                       className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-rose-400 bg-slate-900 shadow-[0_0_35px_rgba(244,63,94,0.35)]"
//                     >
//                       <Square className="h-6 w-6 fill-rose-500 text-rose-500" />
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}

//             {/* Camera switch */}

//             <button
//               onClick={
//                 switchCamera
//               }
//               disabled={isRecording}
//               className="rounded-full bg-white/5 p-2.5 text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
//               title="Switch camera"
//             >
//               <RefreshCw className="h-5 w-5" />
//             </button>
//           </div>

//           {/* Right */}

//           <div className="hidden min-w-[120px] justify-end sm:flex">
//             <div className="text-right">
//               <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-slate-400">
//                 <Maximize2 className="h-3 w-3" />
//                 HD CAMERA
//               </div>

//               <div className="mt-1 text-[9px] text-slate-600">
//                 {filter ===
//                 "normal"
//                   ? "Original lens"
//                   : selectedFilter?.name}
//               </div>
//             </div>
//           </div>
//         </footer>
//       )}

//       {/* =====================================================
//           HIDDEN CANVAS
//       ===================================================== */}

//       <canvas
//         ref={canvasRef}
//         className="pointer-events-none absolute left-[-99999px] top-[-99999px] h-px w-px"
//       />

//       {/* =====================================================
//           HIDDEN TOOLS INDICATOR
//       ===================================================== */}

//       {toolsHidden && (
//         <button
//           onClick={() =>
//             setToolsHidden(false)
//           }
//           className="absolute bottom-4 right-4 z-[100] flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/90 px-4 py-2.5 text-xs font-bold text-slate-300 shadow-2xl backdrop-blur-xl hover:text-white"
//         >
//           <Eye className="h-4 w-4" />
//           Show controls
//         </button>
//       )}
//     </div>
//   );
// };

// export default CameraApp;

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useOS } from "../../context/OSContext";
import { createVFSFile } from "../../lib/vfs";
import { checkAndUnlockAchievement } from "../../lib/achievements";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

import {
  Camera,
  Video,
  RefreshCw,
  Clock3,
  Download,
  Trash2,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Square,
  Play,
  Pause,
  Music2,
  Smile,
  Type,
  Sparkles,
  Eye,
  EyeOff,
  X,
  Plus,
  RotateCcw,
  Volume2,
  VolumeX,
  Wand2,
  Upload,
  Maximize2,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type CameraMode = "photo" | "video";

type FilterId =
  | "normal"
  | "mono"
  | "vivid"
  | "cyber"
  | "horror"
  | "cartoon"
  | "pixel";

type ToolPanel =
  | "filters"
  | "stickers"
  | "text"
  | "music"
  | null;

type OverlayType = "sticker" | "text";

interface OverlayItem {
  id: string;
  type: OverlayType;

  x: number;
  y: number;

  scale: number;
  rotation: number;

  value?: string;
  text?: string;

  fontSize?: number;
  color?: string;

  emoji?: string;
  label?: string;
}

/* =========================================================
   CONSTANTS
========================================================= */

const FILTERS: {
  id: FilterId;
  name: string;
  preview: string;
  css: string;
  canvas: string;
}[] = [
  {
    id: "normal",
    name: "Original",
    preview: "Normal",
    css: "none",
    canvas: "none",
  },
  {
    id: "mono",
    name: "Mono",
    preview: "B&W",
    css: "grayscale(1)",
    canvas: "grayscale(100%)",
  },
  {
    id: "vivid",
    name: "Vivid",
    preview: "Bright",
    css: "contrast(1.25) saturate(1.35) brightness(1.08)",
    canvas: "contrast(125%) saturate(135%) brightness(108%)",
  },
  {
    id: "cyber",
    name: "Cyber",
    preview: "Cyber",
    css: "hue-rotate(165deg) saturate(1.7) contrast(1.15)",
    canvas: "hue-rotate(165deg) saturate(170%) contrast(115%)",
  },
  {
    id: "horror",
    name: "Horror",
    preview: "Dark",
    css: "contrast(1.4) saturate(0.65) brightness(0.72) sepia(0.18)",
    canvas: "contrast(140%) saturate(65%) brightness(72%) sepia(18%)",
  },
  {
    id: "cartoon",
    name: "Cartoon",
    preview: "Pop",
    css: "contrast(1.45) saturate(1.65) brightness(1.05)",
    canvas: "contrast(145%) saturate(165%) brightness(105%)",
  },
  {
    id: "pixel",
    name: "Pixel",
    preview: "Retro",
    css: "contrast(1.7) saturate(1.8)",
    canvas: "contrast(170%) saturate(180%)",
  },
];

const STICKERS = [
  {
    id: "dog",
    label: "Dog",
    emoji: "🐶",
    category: "Funny",
  },
  {
    id: "dog2",
    label: "Puppy",
    emoji: "🐕",
    category: "Funny",
  },
  {
    id: "sunglasses",
    label: "Cool",
    emoji: "😎",
    category: "Funny",
  },
  {
    id: "crown",
    label: "Crown",
    emoji: "👑",
    category: "Funny",
  },
  {
    id: "heart",
    label: "Love",
    emoji: "❤️",
    category: "Love",
  },
  {
    id: "fire",
    label: "Fire",
    emoji: "🔥",
    category: "Funny",
  },
  {
    id: "ghost",
    label: "Ghost",
    emoji: "👻",
    category: "Horror",
  },
  {
    id: "skull",
    label: "Skull",
    emoji: "💀",
    category: "Horror",
  },
  {
    id: "clown",
    label: "Clown",
    emoji: "🤡",
    category: "Funny",
  },
  {
    id: "robot",
    label: "Robot",
    emoji: "🤖",
    category: "Pixel",
  },
  {
    id: "alien",
    label: "Alien",
    emoji: "👽",
    category: "Pixel",
  },
  {
    id: "star",
    label: "Star",
    emoji: "⭐",
    category: "Funny",
  },
  {
    id: "sparkles",
    label: "Sparkles",
    emoji: "✨",
    category: "Funny",
  },
  {
    id: "heart-eyes",
    label: "Love Eyes",
    emoji: "😍",
    category: "Love",
  },
];

const QUOTES = [
  "Good vibes only ✨",
  "Stay focused 🚀",
  "Dream. Build. Repeat.",
  "Main character energy 😎",
  "No limits.",
  "Work hard. Stay humble.",
  "Built different.",
  "Create your own future.",
];

/* =========================================================
   HELPERS
========================================================= */

const createId = (prefix = "item") =>
  `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${String(mins).padStart(2, "0")}:${String(
    secs
  ).padStart(2, "0")}`;
};

const getSupportedMimeType = () => {
  if (typeof MediaRecorder === "undefined") {
    return "";
  }

  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];

  return (
    candidates.find((type) =>
      MediaRecorder.isTypeSupported(type)
    ) || ""
  );
};

const getCanvasFilter = (filterId: FilterId) => {
  return (
    FILTERS.find((filter) => filter.id === filterId)
      ?.canvas || "none"
  );
};

/* =========================================================
   COMPONENT
========================================================= */

export const CameraApp: React.FC = () => {
  const { openApp, updateSettings } = useOS();

  /* -------------------------------------------------------
     VIDEO / CAMERA
  ------------------------------------------------------- */

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const streamRef = useRef<MediaStream | null>(null);

  const [stream, setStream] =
    useState<MediaStream | null>(null);

  const [cameraError, setCameraError] =
    useState<string | null>(null);

  const [facingMode, setFacingMode] = useState<
    "user" | "environment"
  >("user");

  const [mode, setMode] =
    useState<CameraMode>("photo");

  /* -------------------------------------------------------
     FILTER
  ------------------------------------------------------- */

  const [filter, setFilter] =
    useState<FilterId>("normal");

  /* -------------------------------------------------------
     TIMER
  ------------------------------------------------------- */

  const [timerSeconds, setTimerSeconds] =
    useState(0);

  const [countdown, setCountdown] =
    useState<number | null>(null);

  /* -------------------------------------------------------
     CAPTURED MEDIA
  ------------------------------------------------------- */

  const [capturedPhotoUrl, setCapturedPhotoUrl] =
    useState<string | null>(null);

  const [capturedVideoUrl, setCapturedVideoUrl] =
    useState<string | null>(null);

  const [saveStatusText, setSaveStatusText] =
    useState("");

  const [isSaved, setIsSaved] =
    useState(false);

  /* -------------------------------------------------------
     MP4 CONVERSION
  ------------------------------------------------------- */

  const ffmpegRef = useRef<FFmpeg | null>(null);

  const [ffmpegReady, setFfmpegReady] =
    useState(false);

  const [isConverting, setIsConverting] =
    useState(false);

  const [conversionProgress, setConversionProgress] =
    useState(0);

  /* -------------------------------------------------------
     RECORDING
  ------------------------------------------------------- */

  const mediaRecorderRef =
    useRef<MediaRecorder | null>(null);

  const recordedChunksRef =
    useRef<Blob[]>([]);

  const [isRecording, setIsRecording] =
    useState(false);

  const [isPaused, setIsPaused] =
    useState(false);

  const [recordDuration, setRecordDuration] =
    useState(0);

  const recordAnimationRef =
    useRef<number | null>(null);

  /* -------------------------------------------------------
     UI
  ------------------------------------------------------- */

  const [activePanel, setActivePanel] =
    useState<ToolPanel>(null);

  const [toolsHidden, setToolsHidden] =
    useState(false);

  const [flashActive, setFlashActive] =
    useState(false);

  /* -------------------------------------------------------
     OVERLAYS
  ------------------------------------------------------- */

  const [overlays, setOverlays] =
    useState<OverlayItem[]>([]);

  /* -------------------------------------------------------
     DRAGGING
  ------------------------------------------------------- */

  const draggingRef = useRef<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  /* -------------------------------------------------------
     TEXT
  ------------------------------------------------------- */

  const [textInput, setTextInput] =
    useState("");

  /* -------------------------------------------------------
     MUSIC
  ------------------------------------------------------- */

  const audioContextRef =
    useRef<AudioContext | null>(null);

  const musicDestinationRef =
    useRef<MediaStreamAudioDestinationNode | null>(
      null
    );

  const micSourceRef =
    useRef<MediaStreamAudioSourceNode | null>(
      null
    );

  const musicGainRef =
    useRef<GainNode | null>(null);

  const musicTimerRef =
    useRef<number | null>(null);

  const musicOscillatorsRef =
    useRef<OscillatorNode[]>([]);

  const localAudioRef =
    useRef<HTMLAudioElement | null>(null);

  const [musicEnabled, setMusicEnabled] =
    useState(false);

  const [selectedMusic, setSelectedMusic] =
    useState<string | null>(null);

  const [localMusicName, setLocalMusicName] =
    useState<string | null>(null);

  /* =========================================================
     FFMPEG INITIALIZATION
  ========================================================= */

  const loadFFmpeg = useCallback(async () => {
    if (ffmpegRef.current && ffmpegReady) {
      return ffmpegRef.current;
    }

    try {
      const ffmpeg = new FFmpeg();

      ffmpeg.on(
        "progress",
        ({ progress }) => {
          setConversionProgress(
            Math.max(
              0,
              Math.min(
                100,
                Math.round(progress * 100)
              )
            )
          );
        }
      );

      const baseURL =
        "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd";

      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
      });

      ffmpegRef.current = ffmpeg;
      setFfmpegReady(true);

      return ffmpeg;
    } catch (error) {
      console.error(
        "FFmpeg initialization failed:",
        error
      );

      setSaveStatusText(
        "MP4 converter could not be loaded."
      );

      return null;
    }
  }, [ffmpegReady]);

  useEffect(() => {
    loadFFmpeg();
  }, [loadFFmpeg]);

  /* =========================================================
     WEBM → MP4
  ========================================================= */

  const convertWebMToMP4 = async (
    webmBlob: Blob
  ): Promise<Blob | null> => {
    setIsConverting(true);
    setConversionProgress(0);

    try {
      let ffmpeg = ffmpegRef.current;

      if (!ffmpeg) {
        ffmpeg = await loadFFmpeg();
      }

      if (!ffmpeg) {
        return null;
      }

      const inputName = `input-${Date.now()}.webm`;
      const outputName = `output-${Date.now()}.mp4`;

      await ffmpeg.writeFile(
        inputName,
        await fetchFile(webmBlob)
      );

      setConversionProgress(5);

      await ffmpeg.exec([
        "-i",
        inputName,

        "-c:v",
        "libx264",

        "-preset",
        "veryfast",

        "-crf",
        "23",

        "-pix_fmt",
        "yuv420p",

        "-c:a",
        "aac",

        "-b:a",
        "128k",

        "-movflags",
        "+faststart",

        outputName,
      ]);

      const data =
        await ffmpeg.readFile(outputName);

      const mp4Blob = new Blob(
        [data],
        {
          type: "video/mp4",
        }
      );

      try {
        await ffmpeg.deleteFile(inputName);
        await ffmpeg.deleteFile(outputName);
      } catch {
        // Cleanup is optional.
      }

      setConversionProgress(100);

      return mp4Blob;
    } catch (error) {
      console.error(
        "WebM → MP4 conversion failed:",
        error
      );

      setSaveStatusText(
        "MP4 conversion failed. The original recording is still available."
      );

      return null;
    } finally {
      setIsConverting(false);
    }
  };

  /* =========================================================
     CAMERA START
  ========================================================= */

  const stopCamera = useCallback(() => {
    const currentStream =
      streamRef.current;

    if (currentStream) {
      currentStream
        .getTracks()
        .forEach((track) => track.stop());
    }

    streamRef.current = null;
    setStream(null);
  }, []);

  const startCamera = useCallback(
    async (
      facing: "user" | "environment"
    ) => {
      try {
        setCameraError(null);

        stopCamera();

        if (
          !navigator.mediaDevices ||
          !navigator.mediaDevices.getUserMedia
        ) {
          setCameraError(
            "Camera access is not supported in this browser."
          );

          return;
        }

        const newStream =
          await navigator.mediaDevices.getUserMedia(
            {
              video: {
                facingMode: {
                  ideal: facing,
                },
                width: {
                  ideal: 1920,
                },
                height: {
                  ideal: 1080,
                },
                frameRate: {
                  ideal: 30,
                  max: 60,
                },
              },
              audio:
                mode === "video",
            }
          );

        streamRef.current =
          newStream;

        setStream(newStream);

        if (videoRef.current) {
          videoRef.current.srcObject =
            newStream;

          try {
            await videoRef.current.play();
          } catch {
            // Browser may wait for interaction.
          }
        }
      } catch (error: any) {
        console.error(
          "Camera error:",
          error
        );

        if (
          error?.name ===
            "NotAllowedError" ||
          error?.name ===
            "PermissionDeniedError"
        ) {
          setCameraError(
            "Camera permission was denied. Allow camera access in your browser settings."
          );
        } else if (
          error?.name ===
            "NotFoundError" ||
          error?.name ===
            "DevicesNotFoundError"
        ) {
          setCameraError(
            "No camera device was found on this computer."
          );
        } else if (
          error?.name ===
          "NotReadableError"
        ) {
          setCameraError(
            "The camera is already being used by another application."
          );
        } else {
          setCameraError(
            error?.message ||
              "Unable to start the camera."
          );
        }
      }
    },
    [mode, stopCamera]
  );

  useEffect(() => {
    startCamera(facingMode);

    return () => {
      stopCamera();
    };
  }, [facingMode, mode]);

  /* =========================================================
     RECORD TIMER
  ========================================================= */

  useEffect(() => {
    let interval: number | null =
      null;

    if (
      isRecording &&
      !isPaused
    ) {
      interval =
        window.setInterval(() => {
          setRecordDuration(
            (previous) =>
              previous + 1
          );
        }, 1000);
    }

    return () => {
      if (interval) {
        window.clearInterval(
          interval
        );
      }
    };
  }, [isRecording, isPaused]);

  /* =========================================================
     MUSIC ENGINE
  ========================================================= */

  const stopMusic = useCallback(() => {
    if (musicTimerRef.current) {
      window.clearInterval(
        musicTimerRef.current
      );

      musicTimerRef.current = null;
    }

    musicOscillatorsRef.current.forEach(
      (oscillator) => {
        try {
          oscillator.stop();
        } catch {
          // Already stopped.
        }
      }
    );

    musicOscillatorsRef.current =
      [];

    if (localAudioRef.current) {
      localAudioRef.current.pause();
      localAudioRef.current.currentTime =
        0;
    }

    setMusicEnabled(false);
    setSelectedMusic(null);
  }, []);

  const ensureAudioContext =
    () => {
      if (
        audioContextRef.current
      ) {
        return audioContextRef.current;
      }

      const AudioContextClass =
        window.AudioContext ||
        (window as any)
          .webkitAudioContext;

      if (!AudioContextClass) {
        return null;
      }

      const context =
        new AudioContextClass();

      audioContextRef.current =
        context;

      const destination =
        context.createMediaStreamDestination();

      musicDestinationRef.current =
        destination;

      const gain =
        context.createGain();

      gain.gain.value = 0.22;

      gain.connect(destination);
      gain.connect(
        context.destination
      );

      musicGainRef.current =
        gain;

      return context;
    };

  const playGeneratedMusic =
    async (
      trackId: string
    ) => {
      const context =
        ensureAudioContext();

      if (
        !context ||
        !musicGainRef.current
      ) {
        return;
      }

      if (
        context.state ===
        "suspended"
      ) {
        await context.resume();
      }

      stopMusic();

      setSelectedMusic(trackId);
      setMusicEnabled(true);

      const tracks: Record<
        string,
        {
          notes: number[];
          tempo: number;
          wave: OscillatorType;
        }
      > = {
        chill: {
          notes: [
            261.63,
            329.63,
            392,
            329.63,
          ],
          tempo: 550,
          wave: "sine",
        },

        cyber: {
          notes: [
            220,
            277.18,
            329.63,
            440,
          ],
          tempo: 300,
          wave: "square",
        },

        funny: {
          notes: [
            523.25,
            659.25,
            783.99,
            659.25,
          ],
          tempo: 230,
          wave: "triangle",
        },

        horror: {
          notes: [
            110,
            116.54,
            123.47,
            98,
          ],
          tempo: 700,
          wave: "sawtooth",
        },
      };

      const track =
        tracks[trackId] ||
        tracks.chill;

      let index = 0;

      const playNote = () => {
        const oscillator =
          context.createOscillator();

        const gain =
          context.createGain();

        oscillator.type =
          track.wave;

        oscillator.frequency.value =
          track.notes[
            index %
              track.notes.length
          ];

        gain.gain.setValueAtTime(
          0.0001,
          context.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
          0.35,
          context.currentTime +
            0.02
        );

        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          context.currentTime +
            0.35
        );

        oscillator.connect(gain);

        gain.connect(
          musicGainRef.current!
        );

        oscillator.start();

        oscillator.stop(
          context.currentTime +
            0.4
        );

        musicOscillatorsRef.current.push(
          oscillator
        );

        index++;
      };

      playNote();

      musicTimerRef.current =
        window.setInterval(
          playNote,
          track.tempo
        );
    };

  const handleLocalMusic =
    async (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      const context =
        ensureAudioContext();

      if (
        !context ||
        !musicDestinationRef.current
      ) {
        return;
      }

      if (
        context.state ===
        "suspended"
      ) {
        await context.resume();
      }

      stopMusic();

      const url =
        URL.createObjectURL(file);

      const audio =
        new Audio(url);

      audio.loop = true;
      audio.volume = 0.35;
      audio.crossOrigin =
        "anonymous";

      const source =
        context.createMediaElementSource(
          audio
        );

      source.connect(
        musicDestinationRef.current
      );

      source.connect(
        context.destination
      );

      localAudioRef.current =
        audio;

      setLocalMusicName(
        file.name
      );

      setSelectedMusic("local");
      setMusicEnabled(true);

      await audio.play();
    };

  /* =========================================================
     AUDIO MIX
  ========================================================= */

  const createRecordingAudioStream =
    async () => {
      const currentStream =
        streamRef.current;

      if (!currentStream) {
        return null;
      }

      const audioTracks =
        currentStream.getAudioTracks();

      if (
        !musicEnabled ||
        !musicDestinationRef.current
      ) {
        return audioTracks.length
          ? new MediaStream(
              audioTracks
            )
          : null;
      }

      const context =
        ensureAudioContext();

      if (
        !context ||
        !musicDestinationRef.current
      ) {
        return audioTracks.length
          ? new MediaStream(
              audioTracks
            )
          : null;
      }

      try {
        if (
          !micSourceRef.current &&
          audioTracks.length
        ) {
          const micStream =
            new MediaStream(
              audioTracks
            );

          micSourceRef.current =
            context.createMediaStreamSource(
              micStream
            );

          micSourceRef.current.connect(
            musicDestinationRef.current
          );
        }
      } catch (error) {
        console.warn(
          "Could not mix microphone audio:",
          error
        );
      }

      return (
        musicDestinationRef.current
          .stream
      );
    };

  /* =========================================================
     OVERLAYS
  ========================================================= */

  const addSticker = (
    sticker: (typeof STICKERS)[number]
  ) => {
    const overlay: OverlayItem = {
      id: createId("sticker"),
      type: "sticker",
      x: 50,
      y: 45,
      scale: 1,
      rotation: 0,
      emoji: sticker.emoji,
      label: sticker.label,
    };

    setOverlays((previous) => [
      ...previous,
      overlay,
    ]);
  };

  const addText = (
    text: string
  ) => {
    const cleanText =
      text.trim();

    if (!cleanText) {
      return;
    }

    const overlay: OverlayItem = {
      id: createId("text"),
      type: "text",
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0,
      text: cleanText,
      fontSize: 34,
      color: "#ffffff",
    };

    setOverlays((previous) => [
      ...previous,
      overlay,
    ]);

    setTextInput("");
  };

  const removeOverlay = (
    id: string
  ) => {
    setOverlays((previous) =>
      previous.filter(
        (item) => item.id !== id
      )
    );
  };

  const clearOverlays = () => {
    setOverlays([]);
  };

  const updateOverlay = (
    id: string,
    updates: Partial<OverlayItem>
  ) => {
    setOverlays((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
            }
          : item
      )
    );
  };

  /* =========================================================
     DRAG OVERLAYS
  ========================================================= */

  const handleOverlayPointerDown =
    (
      event: React.PointerEvent,
      item: OverlayItem
    ) => {
      event.preventDefault();
      event.stopPropagation();

      const container =
        previewRef.current;

      if (!container) {
        return;
      }

      const rect =
        container.getBoundingClientRect();

      const pointerX =
        ((event.clientX -
          rect.left) /
          rect.width) *
        100;

      const pointerY =
        ((event.clientY -
          rect.top) /
          rect.height) *
        100;

      draggingRef.current = {
        id: item.id,
        offsetX:
          pointerX - item.x,
        offsetY:
          pointerY - item.y,
      };

      (
        event.currentTarget as HTMLElement
      ).setPointerCapture(
        event.pointerId
      );
    };

  const handleOverlayPointerMove =
    (
      event: React.PointerEvent
    ) => {
      const dragging =
        draggingRef.current;

      if (!dragging) {
        return;
      }

      const container =
        previewRef.current;

      if (!container) {
        return;
      }

      const rect =
        container.getBoundingClientRect();

      let x =
        ((event.clientX -
          rect.left) /
          rect.width) *
          100 -
        dragging.offsetX;

      let y =
        ((event.clientY -
          rect.top) /
          rect.height) *
          100 -
        dragging.offsetY;

      x = Math.max(
        4,
        Math.min(96, x)
      );

      y = Math.max(
        6,
        Math.min(94, y)
      );

      updateOverlay(
        dragging.id,
        {
          x,
          y,
        }
      );
    };

  const handleOverlayPointerUp =
    () => {
      draggingRef.current =
        null;
    };

  /* =========================================================
     CANVAS RENDERING
  ========================================================= */

  const drawFrameToCanvas =
    useCallback(
      (
        video: HTMLVideoElement,
        canvas: HTMLCanvasElement
      ) => {
        if (
          !video.videoWidth ||
          !video.videoHeight
        ) {
          return;
        }

        const ctx =
          canvas.getContext("2d");

        if (!ctx) {
          return;
        }

        const width =
          video.videoWidth;

        const height =
          video.videoHeight;

        if (
          canvas.width !== width ||
          canvas.height !== height
        ) {
          canvas.width = width;
          canvas.height = height;
        }

        ctx.clearRect(
          0,
          0,
          width,
          height
        );

        ctx.save();

        ctx.filter =
          getCanvasFilter(filter);

        if (
          facingMode === "user"
        ) {
          ctx.translate(
            width,
            0
          );

          ctx.scale(-1, 1);
        }

        ctx.drawImage(
          video,
          0,
          0,
          width,
          height
        );

        ctx.restore();

        /* ---------------------------------------------
           OVERLAYS
        --------------------------------------------- */

        overlays.forEach(
          (overlay) => {
            const x =
              (overlay.x / 100) *
              width;

            const y =
              (overlay.y / 100) *
              height;

            ctx.save();

            ctx.translate(x, y);

            ctx.rotate(
              ((overlay.rotation ||
                0) *
                Math.PI) /
                180
            );

            ctx.scale(
              overlay.scale || 1,
              overlay.scale || 1
            );

            if (
              overlay.type ===
              "sticker"
            ) {
              ctx.font = `${Math.max(
                30,
                Math.min(
                  width,
                  height
                ) * 0.09
              )}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;

              ctx.textAlign =
                "center";

              ctx.textBaseline =
                "middle";

              ctx.fillText(
                overlay.emoji ||
                  "✨",
                0,
                0
              );
            }

            if (
              overlay.type ===
              "text"
            ) {
              ctx.font = `800 ${
                overlay.fontSize ||
                34
              }px Arial, sans-serif`;

              ctx.textAlign =
                "center";

              ctx.textBaseline =
                "middle";

              ctx.lineWidth = 7;

              ctx.strokeStyle =
                "rgba(0,0,0,0.75)";

              ctx.strokeText(
                overlay.text || "",
                0,
                0
              );

              ctx.fillStyle =
                overlay.color ||
                "#ffffff";

              ctx.fillText(
                overlay.text || "",
                0,
                0
              );
            }

            ctx.restore();
          }
        );
      },
      [
        facingMode,
        filter,
        overlays,
      ]
    );

  /* =========================================================
     PHOTO CAPTURE
  ========================================================= */

  const executeCapture =
    async () => {
      const video =
        videoRef.current;

      const canvas =
        canvasRef.current;

      if (
        !video ||
        !canvas ||
        !video.videoWidth
      ) {
        return;
      }

      setFlashActive(true);

      window.setTimeout(() => {
        setFlashActive(false);
      }, 160);

      drawFrameToCanvas(
        video,
        canvas
      );

      const dataUrl =
        canvas.toDataURL(
          "image/jpeg",
          0.94
        );

      setCapturedPhotoUrl(
        dataUrl
      );

      setCapturedVideoUrl(
        null
      );

      setIsSaved(false);

      try {
        const fileName =
          `IMG_${Date.now()}.jpg`;

        await createVFSFile(
          "/Pictures",
          fileName,
          dataUrl,
          "jpg",
          "image/jpeg"
        );

        setIsSaved(true);

        setSaveStatusText(
          `Saved automatically to /Pictures/${fileName}`
        );

        checkAndUnlockAchievement(
          "camera-shutter"
        );
      } catch (error) {
        console.error(
          "Photo save error:",
          error
        );

        setSaveStatusText(
          "Photo captured, but automatic save failed."
        );
      }
    };

  const handleTriggerPhoto =
    () => {
      if (!streamRef.current) {
        return;
      }

      if (timerSeconds <= 0) {
        executeCapture();
        return;
      }

      setCountdown(
        timerSeconds
      );

      let remaining =
        timerSeconds;

      const interval =
        window.setInterval(() => {
          remaining -= 1;

          if (
            remaining <= 0
          ) {
            window.clearInterval(
              interval
            );

            setCountdown(null);

            executeCapture();
          } else {
            setCountdown(
              remaining
            );
          }
        }, 1000);
    };

  /* =========================================================
     VIDEO RECORDING
  ========================================================= */

  const startRecording =
    async () => {
      const video =
        videoRef.current;

      if (
        !video ||
        !streamRef.current
      ) {
        return;
      }

      const canvas =
        canvasRef.current;

      if (!canvas) {
        return;
      }

      drawFrameToCanvas(
        video,
        canvas
      );

      if (
        typeof canvas.captureStream !==
        "function"
      ) {
        setSaveStatusText(
          "Video recording is not supported by this browser."
        );

        return;
      }

      const canvasStream =
        canvas.captureStream(30);

      const audioStream =
        await createRecordingAudioStream();

      const finalStream =
        new MediaStream();

      canvasStream
        .getVideoTracks()
        .forEach((track) => {
          finalStream.addTrack(
            track
          );
        });

      if (audioStream) {
        audioStream
          .getAudioTracks()
          .forEach((track) => {
            finalStream.addTrack(
              track
            );
          });
      }

      const mimeType =
        getSupportedMimeType();

      let recorder: MediaRecorder;

      try {
        recorder = mimeType
          ? new MediaRecorder(
              finalStream,
              {
                mimeType,
              }
            )
          : new MediaRecorder(
              finalStream
            );
      } catch (error) {
        console.error(
          "MediaRecorder error:",
          error
        );

        setSaveStatusText(
          "This browser cannot start video recording."
        );

        return;
      }

      recordedChunksRef.current =
        [];

      recorder.ondataavailable =
        (event) => {
          if (
            event.data.size > 0
          ) {
            recordedChunksRef.current.push(
              event.data
            );
          }
        };

      recorder.onerror =
        (event) => {
          console.error(
            "Recorder error:",
            event
          );

          setSaveStatusText(
            "Recording error occurred."
          );
        };

      recorder.onstop =
        async () => {
          if (
            recordAnimationRef.current
          ) {
            cancelAnimationFrame(
              recordAnimationRef.current
            );

            recordAnimationRef.current =
              null;
          }

          const webmBlob =
            new Blob(
              recordedChunksRef.current,
              {
                type:
                  mimeType ||
                  "video/webm",
              }
            );

          if (!webmBlob.size) {
            setSaveStatusText(
              "No video data was captured."
            );

            return;
          }

          /*
           * IMPORTANT:
           *
           * The browser records WebM.
           * We now convert it to REAL MP4.
           */

          setSaveStatusText(
            "Converting video to MP4..."
          );

          const mp4Blob =
            await convertWebMToMP4(
              webmBlob
            );

          /*
           * If MP4 conversion succeeds,
           * use MP4 everywhere.
           */

          const finalBlob =
            mp4Blob || webmBlob;

          const finalIsMP4 =
            Boolean(mp4Blob);

          const finalMime =
            finalIsMP4
              ? "video/mp4"
              : "video/webm";

          const url =
            URL.createObjectURL(
              finalBlob
            );

          setCapturedVideoUrl(
            url
          );

          setCapturedPhotoUrl(
            null
          );

          setIsSaved(false);

          /* ---------------------------------------------
             AUTO SAVE
          --------------------------------------------- */

          try {
            const reader =
              new FileReader();

            reader.onloadend =
              async () => {
                try {
                  const base64 =
                    reader.result as string;

                  const extension =
                    finalIsMP4
                      ? "mp4"
                      : "webm";

                  const fileName =
                    `VID_${Date.now()}.${extension}`;

                  await createVFSFile(
                    "/Videos",
                    fileName,
                    base64,
                    extension,
                    finalMime
                  );

                  setIsSaved(true);

                  setSaveStatusText(
                    finalIsMP4
                      ? `Video saved automatically to /Videos/${fileName}`
                      : `Video recorded, but MP4 conversion failed. Saved as /Videos/${fileName}`
                  );

                  checkAndUnlockAchievement(
                    "camera-shutter"
                  );
                } catch (error) {
                  console.error(
                    "Video VFS save error:",
                    error
                  );

                  setSaveStatusText(
                    finalIsMP4
                      ? "MP4 created, but automatic save failed."
                      : "Video recorded, but automatic save failed."
                  );
                }
              };

            reader.readAsDataURL(
              finalBlob
            );
          } catch (error) {
            console.error(
              "Video FileReader error:",
              error
            );
          }

          /* Stop canvas tracks */

          canvasStream
            .getTracks()
            .forEach((track) => {
              track.stop();
            });

          setIsRecording(false);
          setIsPaused(false);
        };

      mediaRecorderRef.current =
        recorder;

      recorder.start(500);

      setIsRecording(true);
      setIsPaused(false);
      setRecordDuration(0);

      /* ---------------------------------------------
         CONTINUOUS CANVAS COMPOSITING
      --------------------------------------------- */

      const renderRecordingFrame =
        () => {
          if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current
              .state !== "inactive"
          ) {
            drawFrameToCanvas(
              video,
              canvas
            );

            recordAnimationRef.current =
              requestAnimationFrame(
                renderRecordingFrame
              );
          }
        };

      renderRecordingFrame();
    };

  const stopRecording =
    () => {
      const recorder =
        mediaRecorderRef.current;

      if (
        recorder &&
        recorder.state !==
          "inactive"
      ) {
        recorder.stop();
      }
    };

  const pauseRecording =
    () => {
      const recorder =
        mediaRecorderRef.current;

      if (!recorder) {
        return;
      }

      if (
        recorder.state ===
        "recording"
      ) {
        recorder.pause();

        setIsPaused(true);
      } else if (
        recorder.state ===
        "paused"
      ) {
        recorder.resume();

        setIsPaused(false);
      }
    };

  /* =========================================================
     WALLPAPER
  ========================================================= */

  const handleSetWallpaper =
    () => {
      if (!capturedPhotoUrl) {
        return;
      }

      updateSettings({
        wallpaperId:
          "custom-photo",
      });

      window.dispatchEvent(
        new CustomEvent(
          "abhishek:set-custom-wallpaper",
          {
            detail: {
              dataUrl:
                capturedPhotoUrl,
            },
          }
        )
      );

      setSaveStatusText(
        "Photo sent to desktop wallpaper."
      );
    };

  /* =========================================================
     MODE SWITCH
  ========================================================= */

  const switchMode = (
    nextMode: CameraMode
  ) => {
    if (isRecording) {
      stopRecording();
    }

    setMode(nextMode);

    setCapturedPhotoUrl(
      null
    );

    setCapturedVideoUrl(
      null
    );

    setSaveStatusText("");
  };

  /* =========================================================
     CAMERA SWITCH
  ========================================================= */

  const switchCamera =
    () => {
      if (isRecording) {
        return;
      }

      setFacingMode(
        (previous) =>
          previous === "user"
            ? "environment"
            : "user"
      );
    };

  /* =========================================================
     TIMER
  ========================================================= */

  const cycleTimer =
    () => {
      setTimerSeconds(
        (previous) => {
          if (previous === 0)
            return 3;

          if (previous === 3)
            return 5;

          return 0;
        }
      );
    };

  /* =========================================================
     RESET CAPTURE
  ========================================================= */

  const resetCapture =
    () => {
      if (
        capturedVideoUrl
      ) {
        URL.revokeObjectURL(
          capturedVideoUrl
        );
      }

      setCapturedPhotoUrl(
        null
      );

      setCapturedVideoUrl(
        null
      );

      setIsSaved(false);

      setSaveStatusText("");

      setConversionProgress(0);
    };

  /* =========================================================
     CLEANUP
  ========================================================= */

  useEffect(() => {
    return () => {
      stopCamera();

      stopMusic();

      if (
        capturedVideoUrl
      ) {
        URL.revokeObjectURL(
          capturedVideoUrl
        );
      }

      if (
        localAudioRef.current
      ) {
        localAudioRef.current.pause();
      }

      if (
        audioContextRef.current
      ) {
        audioContextRef.current.close();
      }

      if (
        recordAnimationRef.current
      ) {
        cancelAnimationFrame(
          recordAnimationRef.current
        );
      }
    };
  }, []);

  /* =========================================================
     UI
  ========================================================= */

  const selectedFilter =
    FILTERS.find(
      (item) =>
        item.id === filter
    );

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-black font-sans text-white select-none">

      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <header className="relative z-50 flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-slate-950/90 px-3 backdrop-blur-xl">

        <div className="flex min-w-0 items-center gap-3">

          <div className="hidden items-center gap-2 sm:flex">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                stream
                  ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]"
                  : "bg-red-500"
              }`}
            />

            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {stream
                ? "Camera Ready"
                : "Offline"}
            </span>
          </div>

          <div className="flex rounded-xl border border-white/10 bg-white/5 p-1">

            <button
              onClick={() =>
                switchMode("photo")
              }
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                mode === "photo"
                  ? "bg-sky-500 text-white shadow-lg"
                  : "text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Camera className="h-3.5 w-3.5" />
              Photo
            </button>

            <button
              onClick={() =>
                switchMode("video")
              }
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                mode === "video"
                  ? "bg-rose-500 text-white shadow-lg"
                  : "text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Video className="h-3.5 w-3.5" />
              Video
            </button>

          </div>
        </div>

        <div className="flex items-center gap-1.5">

          <button
            onClick={() =>
              setActivePanel(
                activePanel ===
                  "filters"
                  ? null
                  : "filters"
              )
            }
            className={`rounded-xl p-2.5 transition ${
              activePanel ===
              "filters"
                ? "bg-sky-500 text-white"
                : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
            title="Filters"
          >
            <Wand2 className="h-4 w-4" />
          </button>

          <button
            onClick={() =>
              setActivePanel(
                activePanel ===
                  "stickers"
                  ? null
                  : "stickers"
              )
            }
            className={`rounded-xl p-2.5 transition ${
              activePanel ===
              "stickers"
                ? "bg-purple-500 text-white"
                : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
            title="Stickers"
          >
            <Smile className="h-4 w-4" />
          </button>

          <button
            onClick={() =>
              setActivePanel(
                activePanel ===
                  "text"
                  ? null
                  : "text"
              )
            }
            className={`rounded-xl p-2.5 transition ${
              activePanel ===
              "text"
                ? "bg-pink-500 text-white"
                : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
            title="Text"
          >
            <Type className="h-4 w-4" />
          </button>

          <button
            onClick={() =>
              setActivePanel(
                activePanel ===
                  "music"
                  ? null
                  : "music"
              )
            }
            className={`rounded-xl p-2.5 transition ${
              activePanel ===
              "music"
                ? "bg-emerald-500 text-white"
                : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
            title="Music"
          >
            <Music2 className="h-4 w-4" />
          </button>

          <button
            onClick={() =>
              setToolsHidden(
                (previous) =>
                  !previous
              )
            }
            className="rounded-xl bg-white/5 p-2.5 text-slate-300 transition hover:bg-white/10"
            title={
              toolsHidden
                ? "Show controls"
                : "Hide controls"
            }
          >
            {toolsHidden ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </button>

        </div>
      </header>

      {/* =====================================================
          CAMERA VIEW
      ===================================================== */}

      <main
        ref={previewRef}
        className="relative min-h-0 flex-1 overflow-hidden bg-black"
        onPointerMove={
          handleOverlayPointerMove
        }
        onPointerUp={
          handleOverlayPointerUp
        }
        onPointerCancel={
          handleOverlayPointerUp
        }
      >

        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-300 ${
            facingMode === "user"
              ? "-scale-x-100"
              : ""
          } ${
            selectedFilter?.css ||
            ""
          } ${
            capturedPhotoUrl ||
            capturedVideoUrl
              ? "opacity-0"
              : "opacity-100"
          }`}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

        {/* RECORDING HUD */}

        {isRecording && (
          <div className="absolute left-4 top-4 z-30 flex items-center gap-2 rounded-full border border-red-300/20 bg-red-600/80 px-3 py-1.5 shadow-xl backdrop-blur-xl">

            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />

            <span className="font-mono text-xs font-bold tracking-widest">
              {formatTime(
                recordDuration
              )}
            </span>

            <span className="text-[10px] uppercase text-red-100">
              {isPaused
                ? "Paused"
                : "Recording"}
            </span>

          </div>
        )}

        {/* MP4 CONVERSION HUD */}

        {isConverting && (
          <div className="absolute inset-0 z-[90] flex items-center justify-center bg-black/60 p-5 backdrop-blur-md">

            <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-slate-950/95 p-6 text-center shadow-2xl">

              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10">
                <Video className="h-7 w-7 animate-pulse text-sky-400" />
              </div>

              <h3 className="text-base font-bold">
                Creating MP4
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Converting your recording to a real MP4 video...
              </p>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-sky-500 transition-all duration-300"
                  style={{
                    width: `${conversionProgress}%`,
                  }}
                />
              </div>

              <div className="mt-2 text-xs font-bold text-sky-400">
                {conversionProgress}%
              </div>

            </div>
          </div>
        )}

        {/* TIMER */}

        {countdown !== null && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">

            <div className="flex h-32 w-32 items-center justify-center rounded-full border border-sky-400/30 bg-black/40 shadow-[0_0_80px_rgba(14,165,233,0.3)]">

              <span className="text-7xl font-black text-white">
                {countdown}
              </span>

            </div>
          </div>
        )}

        {/* FLASH */}

        {flashActive && (
          <div className="pointer-events-none absolute inset-0 z-[100] bg-white" />
        )}

        {/* DRAGGABLE OVERLAYS */}

        {!capturedPhotoUrl &&
          !capturedVideoUrl &&
          overlays.map(
            (overlay) => (
              <div
                key={overlay.id}
                className="group absolute z-20 touch-none cursor-grab active:cursor-grabbing"
                style={{
                  left: `${overlay.x}%`,
                  top: `${overlay.y}%`,
                  transform: `translate(-50%, -50%) rotate(${overlay.rotation}deg) scale(${overlay.scale})`,
                }}
                onPointerDown={(
                  event
                ) =>
                  handleOverlayPointerDown(
                    event,
                    overlay
                  )
                }
                onDoubleClick={() =>
                  removeOverlay(
                    overlay.id
                  )
                }
              >

                {overlay.type ===
                  "sticker" && (
                  <div className="relative">

                    <span className="block text-7xl drop-shadow-[0_8px_20px_rgba(0,0,0,0.55)]">
                      {overlay.emoji}
                    </span>

                    <button
                      onPointerDown={(
                        event
                      ) => {
                        event.stopPropagation();
                      }}
                      onClick={() =>
                        removeOverlay(
                          overlay.id
                        )
                      }
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>

                  </div>
                )}

                {overlay.type ===
                  "text" && (
                  <div className="relative whitespace-nowrap rounded-lg px-2 py-1 text-center font-black text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
                    {overlay.text}
                  </div>
                )}

              </div>
            )
          )}

        {/* CAMERA ERROR */}

        {cameraError && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-5">

            <div className="w-full max-w-md rounded-3xl border border-red-400/20 bg-slate-950/90 p-7 text-center shadow-2xl backdrop-blur-2xl">

              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
                <AlertCircle className="h-7 w-7 text-red-400" />
              </div>

              <h3 className="text-lg font-bold">
                Camera unavailable
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {cameraError}
              </p>

              <div className="mt-5 flex justify-center gap-2">

                <button
                  onClick={() =>
                    startCamera(
                      facingMode
                    )
                  }
                  className="rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-sky-400"
                >
                  Try Again
                </button>

                <button
                  onClick={() =>
                    openApp(
                      "gallery"
                    )
                  }
                  className="rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/15"
                >
                  Gallery
                </button>

              </div>
            </div>
          </div>
        )}

        {/* =================================================
            CAPTURED PHOTO
        ================================================= */}

        {capturedPhotoUrl && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-slate-950 p-4">

            <div className="relative max-h-[70%] max-w-[90%] overflow-hidden rounded-3xl border border-white/15 bg-black shadow-2xl">

              <img
                src={
                  capturedPhotoUrl
                }
                alt="Captured"
                className="max-h-[60vh] max-w-full object-contain"
              />

            </div>

            <div className="mt-5 flex max-w-2xl flex-wrap items-center justify-center gap-2">

              <button
                onClick={
                  handleSetWallpaper
                }
                className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-bold transition hover:bg-sky-400"
              >
                <Sparkles className="h-4 w-4" />
                Wallpaper
              </button>

              <a
                href={
                  capturedPhotoUrl
                }
                download={`IMG_${Date.now()}.jpg`}
                className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold transition hover:bg-white/15"
              >
                <Download className="h-4 w-4" />
                Download
              </a>

              <button
                onClick={() =>
                  openApp(
                    "gallery"
                  )
                }
                className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold transition hover:bg-white/15"
              >
                <ImageIcon className="h-4 w-4" />
                Gallery
              </button>

              <button
                onClick={
                  resetCapture
                }
                className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-300 transition hover:bg-red-500/20"
              >
                <RotateCcw className="h-4 w-4" />
                Retake
              </button>

            </div>

            {saveStatusText && (
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
                <Check className="h-4 w-4" />
                {saveStatusText}
              </div>
            )}

          </div>
        )}

        {/* =================================================
            CAPTURED VIDEO — NOW MP4
        ================================================= */}

        {capturedVideoUrl && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-slate-950 p-4">

            <div className="relative max-h-[65%] max-w-[90%] overflow-hidden rounded-3xl border border-white/15 bg-black shadow-2xl">

              <video
                src={
                  capturedVideoUrl
                }
                controls
                autoPlay
                playsInline
                className="max-h-[65vh] max-w-full"
              />

              <div className="pointer-events-none absolute right-3 top-3 rounded-full border border-emerald-300/20 bg-emerald-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-300 backdrop-blur-xl">
                MP4
              </div>

            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">

              {/* REAL MP4 DOWNLOAD */}

              <a
                href={
                  capturedVideoUrl
                }
                download={`VID_${Date.now()}.mp4`}
                className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-xs font-bold text-white shadow-[0_0_25px_rgba(14,165,233,0.25)] transition hover:bg-sky-400 hover:shadow-[0_0_35px_rgba(14,165,233,0.4)]"
              >
                <Download className="h-4 w-4" />
                Download MP4
              </a>

              <button
                onClick={() =>
                  openApp(
                    "gallery"
                  )
                }
                className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold transition hover:bg-white/15"
              >
                <ImageIcon className="h-4 w-4" />
                Gallery
              </button>

              <button
                onClick={
                  resetCapture
                }
                className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-300 transition hover:bg-red-500/20"
              >
                <RotateCcw className="h-4 w-4" />
                Record Again
              </button>

            </div>

            {saveStatusText && (
              <div className="mt-3 max-w-xl text-center text-xs text-emerald-400">
                <div className="flex items-center justify-center gap-2">
                  <Check className="h-4 w-4 shrink-0" />
                  {saveStatusText}
                </div>
              </div>
            )}

          </div>
        )}

        {/* =================================================
            TOOL PANEL
        ================================================= */}

        {!toolsHidden &&
          activePanel && (
            <div className="absolute bottom-5 left-1/2 z-50 w-[min(94%,720px)] -translate-x-1/2">

              <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/90 shadow-2xl backdrop-blur-2xl">

                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">

                  <div>

                    <h3 className="text-sm font-bold text-white">

                      {activePanel ===
                        "filters" &&
                        "Lens Filters"}

                      {activePanel ===
                        "stickers" &&
                        "Stickers & Effects"}

                      {activePanel ===
                        "text" &&
                        "Text & Captions"}

                      {activePanel ===
                        "music" &&
                        "Music"}

                    </h3>

                    <p className="mt-0.5 text-[10px] text-slate-500">

                      {activePanel ===
                        "filters" &&
                        "Apply a live visual effect"}

                      {activePanel ===
                        "stickers" &&
                        "Drag effects anywhere on screen"}

                      {activePanel ===
                        "text" &&
                        "Add captions and quotes"}

                      {activePanel ===
                        "music" &&
                        "Music will be mixed into video recordings"}

                    </p>

                  </div>

                  <button
                    onClick={() =>
                      setActivePanel(
                        null
                      )
                    }
                    className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>

                </div>

                {/* FILTERS */}

                {activePanel ===
                  "filters" && (
                  <div className="grid grid-cols-4 gap-2 p-4 sm:grid-cols-7">

                    {FILTERS.map(
                      (item) => (
                        <button
                          key={
                            item.id
                          }
                          onClick={() =>
                            setFilter(
                              item.id
                            )
                          }
                          className={`group rounded-2xl border p-2 transition ${
                            filter ===
                            item.id
                              ? "border-sky-400 bg-sky-500/15"
                              : "border-white/5 bg-white/5 hover:bg-white/10"
                          }`}
                        >

                          <div
                            className="mb-2 aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-slate-700 to-slate-950"
                            style={{
                              filter:
                                item.css,
                            }}
                          >
                            <div className="flex h-full items-center justify-center text-3xl">
                              {item.id ===
                              "horror"
                                ? "👻"
                                : item.id ===
                                  "cartoon"
                                ? "🤡"
                                : item.id ===
                                  "pixel"
                                ? "👾"
                                : item.id ===
                                  "cyber"
                                ? "⚡"
                                : "✨"}
                            </div>
                          </div>

                          <div className="text-[10px] font-bold text-slate-300">
                            {item.name}
                          </div>

                        </button>
                      )
                    )}

                  </div>
                )}

                {/* STICKERS */}

                {activePanel ===
                  "stickers" && (
                  <div className="max-h-64 overflow-y-auto p-4">

                    <div className="grid grid-cols-5 gap-2 sm:grid-cols-7">

                      {STICKERS.map(
                        (sticker) => (
                          <button
                            key={
                              sticker.id
                            }
                            onClick={() =>
                              addSticker(
                                sticker
                              )
                            }
                            className="group rounded-2xl border border-white/5 bg-white/5 p-2 transition hover:-translate-y-0.5 hover:border-purple-400/30 hover:bg-purple-500/10"
                          >

                            <div className="flex aspect-square items-center justify-center rounded-xl bg-black/20 text-3xl transition group-hover:scale-110">
                              {
                                sticker.emoji
                              }
                            </div>

                            <div className="mt-1 truncate text-[9px] text-slate-400">
                              {
                                sticker.label
                              }
                            </div>

                          </button>
                        )
                      )}

                    </div>

                    {overlays.length >
                      0 && (
                      <button
                        onClick={
                          clearOverlays
                        }
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/10 bg-red-500/5 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove all overlays
                      </button>
                    )}

                    <p className="mt-3 text-center text-[10px] text-slate-500">
                      Drag an effect with
                      your mouse/finger.
                      Double-click an
                      effect to remove it.
                    </p>

                  </div>
                )}

                {/* TEXT */}

                {activePanel ===
                  "text" && (
                  <div className="p-4">

                    <div className="flex gap-2">

                      <input
                        value={
                          textInput
                        }
                        onChange={(
                          event
                        ) =>
                          setTextInput(
                            event.target
                              .value
                          )
                        }
                        onKeyDown={(
                          event
                        ) => {
                          if (
                            event.key ===
                            "Enter"
                          ) {
                            addText(
                              textInput
                            );
                          }
                        }}
                        placeholder="Write a caption..."
                        className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-400"
                      />

                      <button
                        onClick={() =>
                          addText(
                            textInput
                          )
                        }
                        className="rounded-xl bg-pink-500 px-4 text-white transition hover:bg-pink-400"
                      >
                        <Plus className="h-5 w-5" />
                      </button>

                    </div>

                    <div className="mt-3">

                      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Quick captions
                      </p>

                      <div className="flex flex-wrap gap-2">

                        {QUOTES.map(
                          (quote) => (
                            <button
                              key={
                                quote
                              }
                              onClick={() =>
                                addText(
                                  quote
                                )
                              }
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] text-slate-300 transition hover:border-pink-400/30 hover:bg-pink-500/10 hover:text-white"
                            >
                              {
                                quote
                              }
                            </button>
                          )
                        )}

                      </div>
                    </div>

                  </div>
                )}

                {/* MUSIC */}

                {activePanel ===
                  "music" && (
                  <div className="p-4">

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">

                      {[
                        {
                          id: "chill",
                          name: "Chill",
                          icon: "🌙",
                        },
                        {
                          id: "cyber",
                          name: "Cyber",
                          icon: "⚡",
                        },
                        {
                          id: "funny",
                          name: "Funny",
                          icon: "😂",
                        },
                        {
                          id: "horror",
                          name: "Horror",
                          icon: "👻",
                        },
                      ].map(
                        (track) => (
                          <button
                            key={
                              track.id
                            }
                            onClick={() =>
                              playGeneratedMusic(
                                track.id
                              )
                            }
                            className={`rounded-2xl border p-3 text-left transition ${
                              selectedMusic ===
                              track.id
                                ? "border-emerald-400 bg-emerald-500/10"
                                : "border-white/5 bg-white/5 hover:bg-white/10"
                            }`}
                          >

                            <div className="text-2xl">
                              {
                                track.icon
                              }
                            </div>

                            <div className="mt-2 text-xs font-bold">
                              {
                                track.name
                              }
                            </div>

                            <div className="mt-0.5 text-[9px] text-slate-500">
                              Built-in loop
                            </div>

                          </button>
                        )
                      )}

                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold transition hover:bg-white/10">

                        <Upload className="h-4 w-4" />

                        Add local song

                        <input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={
                            handleLocalMusic
                          }
                        />

                      </label>

                      {localMusicName && (
                        <div className="flex min-w-0 items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">

                          <Music2 className="h-4 w-4 shrink-0" />

                          <span className="max-w-[220px] truncate">
                            {
                              localMusicName
                            }
                          </span>

                        </div>
                      )}

                      {musicEnabled ? (
                        <button
                          onClick={
                            stopMusic
                          }
                          className="flex items-center gap-2 rounded-xl bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20"
                        >
                          <VolumeX className="h-4 w-4" />
                          Stop music
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs text-slate-500">
                          <Volume2 className="h-4 w-4" />
                          No music
                        </div>
                      )}

                    </div>

                    <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
                      Music is mixed into video
                      recordings. Photos do not
                      contain audio.
                    </p>

                  </div>
                )}

              </div>
            </div>
          )}

      </main>

      {/* =====================================================
          BOTTOM BAR
      ===================================================== */}

      {!toolsHidden && (
        <footer className="relative z-50 flex h-[76px] shrink-0 items-center justify-between border-t border-white/10 bg-slate-950/95 px-4 backdrop-blur-xl">

          <button
            onClick={() =>
              openApp("gallery")
            }
            className="flex min-w-[90px] items-center gap-2 rounded-xl px-2 py-2 text-left text-slate-400 transition hover:bg-white/5 hover:text-white"
          >

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10">
              <ImageIcon className="h-5 w-5 text-sky-400" />
            </div>

            <div className="hidden sm:block">
              <div className="text-[11px] font-bold">
                Gallery
              </div>

              <div className="text-[9px] text-slate-600">
                Pictures & videos
              </div>
            </div>

          </button>

          <div className="flex items-center gap-3">

            {mode === "photo" && (
              <button
                onClick={
                  cycleTimer
                }
                className={`relative rounded-full p-2.5 transition ${
                  timerSeconds
                    ? "bg-amber-500/20 text-amber-300"
                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
                title="Timer"
              >

                <Clock3 className="h-5 w-5" />

                {timerSeconds >
                  0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[8px] font-black text-black">
                    {
                      timerSeconds
                    }
                  </span>
                )}

              </button>
            )}

            {mode ===
            "photo" ? (
              <button
                onClick={
                  handleTriggerPhoto
                }
                disabled={
                  !stream ||
                  countdown !==
                    null
                }
                className="group flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_0_35px_rgba(255,255,255,0.25)] transition hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <div className="h-12 w-12 rounded-full border-[3px] border-slate-950 bg-white transition group-hover:border-sky-500" />
              </button>
            ) : (
              <>
                {!isRecording ? (
                  <button
                    onClick={
                      startRecording
                    }
                    disabled={
                      !stream
                    }
                    className="group flex h-16 w-16 items-center justify-center rounded-full bg-rose-500 shadow-[0_0_35px_rgba(244,63,94,0.35)] transition hover:scale-105 active:scale-95 disabled:opacity-30"
                  >
                    <div className="h-6 w-6 rounded-full bg-white" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2">

                    <button
                      onClick={
                        pauseRecording
                      }
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10"
                    >
                      {isPaused ? (
                        <Play className="h-5 w-5 fill-current" />
                      ) : (
                        <Pause className="h-5 w-5 fill-current" />
                      )}
                    </button>

                    <button
                      onClick={
                        stopRecording
                      }
                      className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-rose-400 bg-slate-900 shadow-[0_0_35px_rgba(244,63,94,0.35)]"
                    >
                      <Square className="h-6 w-6 fill-rose-500 text-rose-500" />
                    </button>

                  </div>
                )}
              </>
            )}

            <button
              onClick={
                switchCamera
              }
              disabled={
                isRecording
              }
              className="rounded-full bg-white/5 p-2.5 text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
              title="Switch camera"
            >
              <RefreshCw className="h-5 w-5" />
            </button>

          </div>

          <div className="hidden min-w-[120px] justify-end sm:flex">

            <div className="text-right">

              <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-slate-400">
                <Maximize2 className="h-3 w-3" />
                HD CAMERA
              </div>

              <div className="mt-1 text-[9px] text-slate-600">
                {filter ===
                "normal"
                  ? "Original lens"
                  : selectedFilter?.name}
              </div>

            </div>

          </div>

        </footer>
      )}

      {/* =====================================================
          HIDDEN CANVAS
      ===================================================== */}

      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute left-[-99999px] top-[-99999px] h-px w-px"
      />

      {/* =====================================================
          HIDDEN TOOLS INDICATOR
      ===================================================== */}

      {toolsHidden && (
        <button
          onClick={() =>
            setToolsHidden(
              false
            )
          }
          className="absolute bottom-4 right-4 z-[100] flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/90 px-4 py-2.5 text-xs font-bold text-slate-300 shadow-2xl backdrop-blur-xl hover:text-white"
        >
          <Eye className="h-4 w-4" />
          Show controls
        </button>
      )}
    </div>
  );
};

export default CameraApp;