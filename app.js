var app = new Vue({
  el: '#app',
  data: {
    scanner: null,
    activeCameraId: null,
    cameras: [],
    scans: [],
    names:[],
    sdIDOut:''
  },
  
  mounted: function () {
    // data from scan
    var self = this;
    var id;
    self.scanner = new Instascan.Scanner({ video: document.getElementById('preview'), scanPeriod: 5 });
    self.scanner.addListener('scan', function (content, image) {

            //insert data to history
            axios.post('https://ประชุมเชียร์วิศวะบางมด.com/api/insertDATA', {
                studentID: content,
            })
            .then(function (response) {

            //
            const toast = swal.mixin({
              toast: true,
              position: 'top-left',
              showConfirmButton: false,
              timer: 3000
            });
          
            toast({
              type: 'error',
              title: response.data
            })
            console.log(response.data);
            })
            .catch(function (error) {

                //data form scan output to department
                axios.post('https://ประชุมเชียร์วิศวะบางมด.com/api/ProfileDetailDepartment', {
                    studentID: content,
                })
                .then(function (response) {
                    // playsound 
                    var audio = document.getElementById("myAudio"); 
                    audio.play();
                    document.getElementById('department').innerHTML = response.data;
                })
                .catch(function (error) {
                    swal({
                      type: 'error',
                      title: 'ยืนยันตัวตนผิดพลาด',
                      text: 'ไม่พบผู้ใช้งานในนี้ในฐานข้อมูลของเรา',
                      footer: '<a href>โปรดติดต่อ สโมสรนักศึกษาคณะวิศวกรรมศาสตร์</a>'
                    });
                    document.getElementById('department').innerHTML = "คณะ";
                    // console.log(error);
                });

                // get name
                axios({
                    method:'post',
                    url: 'https://ประชุมเชียร์วิศวะบางมด.com/api/ProfileDetail',
                    data: {
                        studentID:content
                    }
                })
                .then(function (response) {
                    // playsound 
                    var audio = document.getElementById("myAudio"); 
                    audio.play();
                    self.sdIDOut = content;
                    self.scans.unshift({ date: +(Date.now()), content: content });
                    self.names.unshift({ date: +(Date.now()), name: response.data });
                })
                .catch(function (error) {
                    console.log(" no data");
                    console.log(error);
                });
                console.log(error);
            });

    });
    // camera
    Instascan.Camera.getCameras().then(function (cameras) {
      self.cameras = cameras;
      if (cameras.length > 0) {
        self.activeCameraId = cameras[0].id;
        self.scanner.start(cameras[0]);
      } else {
        console.error('ไม่พบรายชื่อกล้อง.');
      }
    }).catch(function (e) {
      console.error(e);
    });
  },
  methods: {
    // data from scan
    formatName: function (name) {
      return name || '(ไม่พบรายชื่อกล้อง)';
    },
    // camera
    selectCamera: function (camera) {
      this.activeCameraId = camera.id;
      this.scanner.start(camera);
    },
    // form sent data
    postStudentID: function() {
      var thiss = this;
      // data form input
      id = document.getElementById('studentID').value;

        //insert data to history
        axios.post('https://ประชุมเชียร์วิศวะบางมด.com/api/insertDATA', {
          studentID: document.getElementById('studentID').value,
        })
        .then(function (response) {
          const toast = swal.mixin({
            toast: true,
            position: 'top-left',
            showConfirmButton: false,
            timer: 3000
          });
        
          toast({
            type: 'error',
            title: response.data
          })
          console.log(response.data);
        })
        .catch(function (error) {

        //data form input output to department
          axios.post('https://ประชุมเชียร์วิศวะบางมด.com/api/ProfileDetailDepartment', {
            studentID: document.getElementById('studentID').value,
          })
          .then(function (response) {
            // playsound 
            var audio = document.getElementById("myAudio"); 
            audio.play();
            document.getElementById('department').innerHTML = response.data;
          })
          .catch(function (error) {
              swal({
                type: 'error',
                title: 'ยืนยันตัวตนผิดพลาด',
                text: 'ไม่พบผู้ใช้งานในนี้ในฐานข้อมูลของเรา',
                footer: '<a href>โปรดติดต่อ สโมสรนักศึกษาคณะวิศวกรรมศาสตร์</a>'
              });
              document.getElementById('department').innerHTML = "คณะ";
              console.log(error);
          });
  
          //data form input output to name
          axios.post('https://ประชุมเชียร์วิศวะบางมด.com/api/ProfileDetail', {
            studentID: document.getElementById('studentID').value,
          })
          .then(function (response) {
              // playsound 
              var audio = document.getElementById("myAudio"); 
              audio.play();
              thiss.sdIDOut = thiss.$refs.studentID.value;
              thiss.scans.unshift({ date: +(Date.now()), content: document.getElementById('studentID').value });
              thiss.names.unshift({ date: +(Date.now()), name: response.data });
          })
          .catch(function (error) {
            thiss.sdIDOut = "ชื่อ - นามสกุล";
            console.log(error);
          });

          console.log(error);
        });

    }
  }
});
