const mongoose = require("mongoose");
require("dotenv").config();

const AudioConfig = require("../gallery/gaudio"); 
// adjust path if needed

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/yourdbname", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

async function seedAudioConfig() {
  try {
    await AudioConfig.deleteMany({});
    console.log("Old audio config removed");

    const audioConfig = {
      audioTracks: [
        {
          id: "bg_01",
          name: "Calm Inspiration",
          url: "https://2mtegaywr8.ucarecd.net/361e5d1f-266b-4a26-b7dd-3b1978d4e6af/motivationmotivationalbackgroundmusic388288.mp3",
          duration: 120,
          size: "2.5MB",
          type: "background",
          isDefault: true
        },
        {
          id: "bg_02",
          name: "Soft Piano",
          url: "https://2mtegaywr8.ucarecd.net/f1310dfc-d249-43e0-bad7-a43fd9cdcc60/backgroundmusicsoftpiano334995.mp3",
          duration: 150,
          size: "2.4MB",
          type: "background",
          isDefault: false
        },
        {
          id: "fx_hover",
          name: "Hover Light Effect",
          url: "https://2mtegaywr8.ucarecd.net/be38f0f1-c498-470d-8f4c-032be497fa0f/whoosheffect405447.mp3",
          duration: 1,
          size: "32KB",
          type: "effect",
          isDefault: false
        },
        {
          id: "fx_click",
          name: "Button Click",
          url: "https://2mtegaywr8.ucarecd.net/19e61329-d785-4bc3-adc6-595095e576e3/uibuttonclick8341030.mp3",
          duration: 1,
          size: "5.7KB",
          type: "effect",
          isDefault: false
        }
      ],

      globalMuted: false,
      globalAutoPlay: true,
      globalVolume: 0.8,

      backgroundMusic: {
        enabled: true,
        track: "bg_01",
        volume: 0.7,
        fadeIn: true,
        fadeOut: true,
        loop: true
      },

      soundEffects: {
        enabled: true,
        volume: 1.0,
        hoverSound: "fx_hover",
        clickSound: "fx_click",
        transitionSound: null
      },

      controlsVisibility: {
        showPlayPause: true,
        showVolumeControl: true,
        showAutoPlayToggle: false,
        showOnMobile: true,
        position: "bottom-right"
      }
    };

    const result = await AudioConfig.create(audioConfig);
    console.log("AudioConfig seeded:", result);

    process.exit();
  } catch (err) {
    console.error("Error seeding:", err);
    process.exit(1);
  }
}

seedAudioConfig();
