// const cameraFeed = document.getElementById("cameraFeed");
// const captureButton = document.getElementById("captureButton");
// const scanButton = document.getElementById("scanButton");
// const resultElem = document.getElementById("result");

// function decode(src, readers) {
//   return new Promise((resolve, reject) => {
//     Quagga.decodeSingle(
//       {
//         src: src,
//         numOfWorkers: navigator.hardwareConcurrency || 1,
//         decoder: {
//           readers: readers,
//         },
//       },
//       (result) => {
//         setTimeout(() => {
//           if (result && result.codeResult) {
//             resolve(`Barcode for ${readers} : ${result.codeResult.code}`);
//           } else {
//             resolve(`No barcode detected for ${readers}`);
//           }
//         }, 100);
//       },
//       (error) => {
//         reject(error);
//       }
//     );
//   });
// }
// // getUserMedia constraints
// // const constraints = {
// //   video: true,
// // };
// const constraints = {
//   video: {
//     facingMode: { exact: "environment" },
//   },
// };

// navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
//   cameraFeed.srcObject = stream;
//   cameraFeed.play();
// });

// const func = () => {
//   const canvas = document.createElement("canvas");
//   canvas.width = cameraFeed.videoWidth;
//   canvas.height = cameraFeed.videoHeight;
//   canvas.getContext("2d").drawImage(cameraFeed, 0, 0);
//   const imgUrl = canvas.toDataURL();
//   return imgUrl;
// };

// captureButton.addEventListener("click", () => {
//   imgUrl = func();
//   resultElem.innerHTML = `<img src="${imgUrl}"/>`;
// });

// scanButton.addEventListener("click", async () => {
//   imgUrl = func();
//   func();
//   let readers = [
//     "code_128_reader",
//     "upc_e_reader",
//     "upc_reader",
//     "ean_8_reader",
//     "code_39_reader",
//     "ean_reader",
//     "code_39_vin_reader",
//     "codabar_reader",
//     "i2of5_reader",
//     "2of5_reader",
//     "code_93_reader",
//   ];
//   let barcodeDetected = false;

//   for (let i = 0; i < readers.length && !barcodeDetected; i++) {
//     const reader = readers[i];
//     const result = await decode(imgUrl, [reader]);
//     console.log(result);
//     resultElem.textContent = result;
//     if (result.includes("Barcode")) {
//       alert(result);
//       barcodeDetected = true;
//     }
//   }
//   if (barcodeDetected === false) alert("Unable to detect barcode");
// });














// for 15 times 
const cameraFeed = document.getElementById("cameraFeed");
const captureButton = document.getElementById("captureButton");
const scanButton = document.getElementById("scanButton");
const resultElem = document.getElementById("result");

function decode(src, readers) {
  return new Promise((resolve, reject) => {
    Quagga.decodeSingle(
      {
        src: src,
        numOfWorkers: navigator.hardwareConcurrency || 1,
        decoder: {
          readers: readers,
        },
      },
      (result) => {
        setTimeout(() => {
          if (result && result.codeResult) {
            resolve(`Barcode for ${readers} : ${result.codeResult.code}`);
          } else {
            resolve(`No barcode detected for ${readers}`);
          }
        }, 0);
      },
      (error) => {
        reject(error);
      }
    );
  });
}

const constraints = {
  video: {
    facingMode: { exact: "environment" },
  },
};

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  cameraFeed.srcObject = stream;
  cameraFeed.play();
});

const func = () => {
  const canvas = document.createElement("canvas");
  canvas.width = cameraFeed.videoWidth;
  canvas.height = cameraFeed.videoHeight;
  canvas.getContext("2d").drawImage(cameraFeed, 0, 0);
  const imgUrl = canvas.toDataURL();
  return imgUrl;
};

// captureButton.addEventListener("click", () => {
//   // imgUrl = func();
//   // resultElem.innerHTML = `<img src="${imgUrl}"/>`;
// });

scanButton.addEventListener("click", async () => {
  imgUrl = func();
  func();

  let readers = [
    "upc_e_reader",
    "upc_reader",
    "code_128_reader",
   
    "ean_8_reader",
    "code_39_reader",
    "ean_reader",
    "code_39_vin_reader",
    "codabar_reader",
    "i2of5_reader",
    "2of5_reader",
    "code_93_reader",
  ];
  let barcodeArray = [];
  let barcodeDetected = false;

  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < readers.length && !barcodeDetected; j++) {
      const reader = readers[j];
      const result = await decode(imgUrl, [reader]);
      resultElem.textContent = result;
      if (result.includes("Barcode")) {
        barcodeArray.push(result);
        barcodeDetected = true;
      }
    }
    if (barcodeDetected === false) {
      alert("Nothing detected in the first attempt ");
      return;
    }
    barcodeDetected = false;
  }
  // after traversing 15 times calling validate function to check the count
  validate(barcodeArray);
});

function validate(arr) {
  var mf = 1;
  var m = 0;
  var item;
  for (var i = 0; i < arr.length; i++) {
    for (var j = i; j < arr.length; j++) {
      if (arr[i] == arr[j]) m++;
      if (mf < m) {
        mf = m;
        item = arr[i];
      }
    }
    m = 0;
  }
  if (mf > 4) {
    alert(item);
  } else alert("Unable to detect barcode");
}
