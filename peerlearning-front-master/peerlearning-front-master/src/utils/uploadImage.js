import { getUploadToken } from '@/api/upload.js';
const qiniu = require('qiniu-js');
export function uploadImage(str){
    return new Promise((resolve, reject) => {
        const {fileName, blob} = str

        console.log('fileName:', fileName);
        console.log('blob:', blob);

        const promise = getUploadToken({ 'filename': fileName });
        promise.then((data) => {
            console.log('getUploadToken data:', data);
            console.log(data)
            const data_1 = data.data
            const { status } = data_1
            if (status) {
                const { data } = data_1
                const { token } = data[0]

                // const file = new File([blob], fileName, { type: 'image/' + imageFormat });
                const file = blob;
                console.log('file', file)
                const putExtra = {};
                const config = { region: qiniu.region.na0 };
                const observable = qiniu.upload(file, fileName, token, putExtra, config)
                
                    const observer = {
                        next(res) {
                            // ...
                        },
                        error(err) {
                            reject(err);
                        },
                        complete(res) {
                            const url = 'http://qn.gxc111.top/' + res.key;
                            console.log("url", url);
                            resolve(url);
                        }
                    };
                    const subscription = observable.subscribe(observer);
                
            } else {
                alert("获取token失败!");
                console.error("获取token失败!", error);
                return null;
            }

        }).catch((error) => {
            console.log('getUploadToken error:', error);
            console.log(error);
        })
    });
}