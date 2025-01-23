import { execSync } from 'child_process';

function getHardwareTypeForConfig() {
    const modelOutput = execSync('cat /proc/device-tree/model').toString();
    const pi4bSys = 'Raspberry Pi 4 Model B';
    const mangoPiSys = 'MangoPi Mcore';
    const piCM4Sys = 'Raspberry Pi Compute Module 4';

    if (modelOutput.includes(pi4bSys) || modelOutput.includes(piCM4Sys)) {
      return 'pi';
    } else if (modelOutput.includes(mangoPiSys)) {
      return 'h616';
    } else {
      return 'none';
    }
}

const hardware = getHardwareTypeForConfig();

const defaultConfig = {
    "version": 2,
    "log": {
      "console": {
        "enabled": true,
        "level": "info"
      },
      "file": {
        "enabled": true,
        "level": "trace",
        "fileName": "/mnt/tmp/logs/app.log",
        "flags": "a",
        "maxLogSize": 30,
        "backups": 3
      }
    },
    "userManager": {
      "userFile": "./config/user.json"
    },
    "server": {
      "protocol": "https",
      "ssl": {
        "key": "./lib/https/key.pem",
        "cert": "./lib/https/cert.pem"
      },
      "rootPath": "/mnt/blikvm/web_src/web_server",
      "configPath": "/usr/bin/blikvm/package.json",
      "sshUser": "blikvm",
      "sshPassword": "blikvm",
      "auth": true
    },
    "video": {
      "port": 10004,
      "shell": "./lib/kvmd-video.sh",
      "bin": `./lib/${hardware}/ustreamer.bin`,
      "fps": 30,
      "quality": 80,
      "kbps": 5000,
      "gop": 30,
      "resolution": "1920x1080",
      "recordPath": "/mnt/tmp/record",
      "recordBin": `./lib/${hardware}/ustreamer-dump`
    },
    "kvmd": {
      "bin": `./lib/${hardware}/kvmd-main`,
      "janusBin": `./lib/${hardware}/janus`,
      "switch": {
        "enabled": false,
        "devicePath": "/dev/ttyUSB0",
        "module": "BliKVM_switch_v1",
        "list": [
          "BliKVM_switch_v1",
          "BliKVM_switch_v2"
        ],
        "blikvm_switch_v1_lable": [
          "channel_1",
          "channel_2",
          "channel_3",
          "channel_4"
        ],
        "blikvm_switch_v2_lable": [
          "channel_1",
          "channel_2",
          "channel_3",
          "channel_4",
          "channel_5",
          "channel_6",
          "channel_7",
          "channel_8"
        ]
      }
    },
    "display": {
      "isActive": true,
      "mode": 1,
      "onBootTime": 3600,
      "cycleInterval": 60,
      "displayTime": 10
    },
    "atx": {
      "controlSockFilePath": "/var/blikvm/atx.sock",
      "stateSockFilePath": "/dev/shm/blikvm/atx",
      "power_on_delay": 500,
      "power_off_delay": 5000
    },
    "msd": {
      "isoFilePath": "/mnt/msd/user",
      "shell": "./lib/kvmd-msd.sh",
      "stateFilePath": "/mnt/msd/config/msd.json",
      "tusPort": 10002
    },
    "hid": {
      "hidEnable": "./lib/hid/enable-gadget.sh",
      "hidDisable": "./lib/hid/disable-gadget.sh",
      "enable": true,
      "absoluteMode": true,
      "mouseJiggler": false,
      "shortcuts": {
        "Ctrl+Alt+Del": [
          "ControlLeft",
          "AltLeft",
          "Delete"
        ],
        "Alt+Tab": [
          "AltLeft",
          "Tab"
        ],
        "Alt+F4": [
          "AltLeft",
          "F4"
        ],
        "Alt+Enter": [
          "AltLeft",
          "Enter"
        ],
        "Ctrl+W": [
          "ControlLeft",
          "KeyW"
        ]
      }
    }
};

export default defaultConfig;