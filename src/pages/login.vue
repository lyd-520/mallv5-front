<template>
  <div class="login">
    <div class="container">
      <a href="/#/index"><img src="/resource/imgs/login-logo.png" alt="">返回首页</a>
    </div>
    <div class="wrapper">
      <div class="container">
        <div class="login-form">
          <h3>
            <span class="checked">帐号登录</span><span class="sep-line">|</span><span>扫码登录</span>
          </h3>
          <div class="input">
            <input type="text" placeholder="请输入帐号" v-model="username" @keyup.enter="login">
          </div>
          <div class="input">
            <input type="password" placeholder="请输入密码" v-model="password" @keyup.enter="login">
          </div>
          <div class="input">
            <input type="phone" placeholder="请输入手机号码" v-model="phone" @keyup.enter="login">
          </div>
          <div class="input">
            <img :src="verifyImg" @click="reloadVerifyCode"/>
          </div>
          <div class="input">
            <input type="text" placeholder="请输入验证码" v-model="verifycode" @keyup.enter="login">
          </div>
          <div class="btn-box">
            <a href="javascript:;" class="btn" @click="login">登录</a>
          </div>
          <div class="tips">
            <div class="sms" @click="register">点击注册</div>
            <div class="reg">立即注册<span>|</span>忘记密码？</div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
<!--      <div class="footer-link">-->
<!--        <a href="http://www.tulingxueyuan.cn/" target="_blank">图灵学院</a><span>|</span>-->
<!--        <a href="https://ke.qq.com/course/231516?tuin=a6505b53" target="_blank">腾讯课堂java架构师培训</a><span>|</span>-->
<!--        <a href="https://ke.qq.com/course/429988" target="_blank">数据结构与算法</a><span>|</span>-->
<!--        <a href="https://tuling.ke.qq.com/" target="_blank">腾讯课堂图灵学院</a>-->
<!--      </div>-->
      <p class="copyright">Copyright ©2023 customizedByLyd</p>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import {setCookie} from '@/util/support';

import Qs from 'qs'

export default {
  Qs,
  name: 'login',
  data(){
    return {
      username:'',
      password:'',
      phone:'',
      verifycode:'',
      verifyImg:'/sso/verifyCode',
      userId:''
    }
  },
  methods:{
    login(){ 
      let { username,password,verifycode } = this;
      
      this.axios.post(
        '/sso/login',
         Qs.stringify({
         username:username,
         password:password,
         // phone:phone,
         verifyCode: verifycode
         }),{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((res)=>{
            this.$cookie.set('token',res.tokenHead+' '+res.token,{expires:'1M'});
            this.$cookie.set('memberId',res.memberId,{expires:'1M'});
            this.$cookie.set('nickName',res.nickName,{expires:'1M'});
            this.$store.dispatch('saveToken',res.token);
            this.$store.dispatch('saveMemberId',res.memberId);
            this.$store.dispatch('saveNickName',res.nickName);


           var tokenStr= decodeURIComponent(escape(window.atob(res.token.split('.')[1])));
           let username = JSON.parse(tokenStr).user_name;
           setCookie("username",username,120);
           this.saveUserName(username);
            
           this.$router.push({
              name:'index',
              params:{
                from:'login'
              }
            });
      })
    },
    ...mapActions(['saveUserName']),  
    register(){ 
      // 验证码就写死了吧
      this.axios.get('/sso/getAuthCode',{
        params: {
            telephone: this.phone,
        }
      }).then((authCode)=>{ 
      this.axios.post('/sso/register', 
         Qs.stringify({
         username:this.username,
         password:this.password, 
         telephone:this.phone,
         authCode, 
         }),{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(()=>{ 
        this.$message.success('注册成功');
      })
      })
    },
    reloadVerifyCode(){
      var timenow = new Date().getTime();
      this.verifyImg="/sso/verifyCode?d="+timenow;
    }
  }
}
</script>
<style lang="scss">
.login{
  &>.container{
    height:113px;
    img{
      width:auto;
      height:100%;
    }
  }
  .wrapper{
    background:url('/resource/imgs/login-bg.jpg') no-repeat center;
    .container{
      height:576px;
      .login-form{
        box-sizing: border-box;
        padding-left: 31px;
        padding-right: 31px;
        width:410px;
        height:510px;
        background-color:#ffffff;
        position:absolute;
        bottom:29px;
        right:0;
        h3{
          line-height:23px;
          font-size:24px;
          text-align:center;
          margin:40px auto 49px;
          .checked{
            color:#FF6600;
          }
          .sep-line{
            margin:0 32px;
          }
        }
        .input{
          display:inline-block;
          width:348px;
          height:50px;
          border:1px solid #E5E5E5;
          margin-bottom:20px;
          input{
            width: 100%;
            height: 100%;
            border: none;
            padding: 18px;
          }
        }
        .btn{
          width:100%;
          line-height:50px;
          margin-top:10px;
          font-size:16px;
        }
        .tips{
          margin-top:14px;
          display:flex;
          justify-content:space-between;
          font-size:14px;
          cursor:pointer;
          .sms{
            color:#FF6600;
          }
          .reg{
            color:#999999;
            span{
              margin:0 7px;
            }
          }
        }
      }
    }
  }
  .footer{
    height:100px;
    padding-top:60px;
    color:#999999;
    font-size:16px;
    text-align:center;
    .footer-link{
      a{
        color:#999999;
        display:inline-block;
      }
      span{
        margin:0 10px;
      }
    }
    .copyright{
      margin-top:13px;
    }
  }
}
</style>