<template>
  <div class="detail">
    <product-param v-bind:title="product.name"></product-param>
    <div class="wrapper">
      <div class="container clearfix">
        <div class="swiper">
          <swiper :options="swiperOption">
            <swiper-slide v-for="(item, index) of albumPics" :key="index"
              ><img :src="item" alt="" />
            </swiper-slide>
            <!-- <swiper-slide><img src="/imgs/detail/phone-2.jpg" alt=""></swiper-slide>
              <swiper-slide><img src="/imgs/detail/phone-3.jpg" alt=""></swiper-slide>
              <swiper-slide><img src="/imgs/detail/phone-4.jpg" alt=""></swiper-slide>   -->
            <!-- Optional controls -->
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
        <div class="content">
          <h2 class="item-title">{{ product.name }}</h2>
          <!-- <p class="item-info">相机全新升级 / 960帧超慢动作 / 手持超级夜景 / 全球首款双频GPS / 骁龙845处理器 / 红<br/>外人脸解锁 / AI变焦双摄 / 三星 AMOLED 屏</p> -->
          <p class="item-info">{{ product.subTitle }}</p>
          <div class="item-price">{{ product.flashPromotionPrice }}元</div>
          <div class="line"></div>
          <div class="item-version clearfix">
            <h2>选择规格</h2>
            <div
              class="phone fl"
              v-for="(item, index) of product.skuStockList"
              :key="index"
              :class="[ {checked: clicked == index},{disabled: (item.stock-item.lockStock)<=0} ]"
              :skuId="item.id"
              @click="handlerSkuid(item, index)"
            >
              {{ item.sp1 + item.sp2 }}
            </div>
          </div>
          <div class="item-total">
            <div class="phone-info clearfix">
              <div class="stock" v-if="clicked==null">
                <i class="fa fa-exclamation-triangle f2" aria-hidden="true" ></i>
                请选择规格
              </div>
              <div class="fr" v-if="skuName" v-html="skuName"></div>
            </div>
            <div class="phone-total" v-if="skuPrice>0">总计：{{ skuPrice }}元</div>
          </div>
          <div style="margin: 20px;font-size:24px">
            <span>验证码:</span>
            <input  type="text" name="verifyCode"  v-model="verifyCode"
                    style="width:80px;height:32px;margin: 20px;font-size:18px"  />
            <img  v-bind:src="verifyCodeInfoUrl" @click="refreshCode"
                  stype="width:80px;height:32px;margin: 20px;"/>
          </div>
          <div class="btn-group">
<!--            <a href="javascript:;" class="btn btn-huge fl" @click="secKill">放入购物车</a>-->
            <a href="javascript:;" class="btn btn-huge fl" @click="secKill()" disabled="true" id="secKillbtn">立即秒杀</a>
            </div>
          <div class="btn-group" style="margin: 16px;font-size:16px">
                  <span>
                    <em>库存数量=></em>
                  </span>
                  <span>
                    {{stock}}件
<!--                   <input type="text" readonly :value="product.stock">-->
                  </span>
          </div>
          <div class="after-sale-info">
            <span><a href="javascript:void(0);"
                     v-if="serviceIds.includes('1')" class="support" >
                <i class="fa fa-check-circle-o f2" aria-hidden="true"></i>
                <em>无忧退货</em>
              </a></span>
            <span><a href="javascript:void(0);" v-if="serviceIds.includes('2')" class="support">
                <i class="fa fa-check-circle-o f2" aria-hidden="true"></i>
                <em>快速退款</em></a>
            </span>
            <span><a href="javascript:void(0);" v-if="serviceIds.includes('3')" class="support"             >
                <i class="fa fa-check-circle-o f2" aria-hidden="true"></i>
                <em>免费包邮</em>
            </a></span>
          </div>
        </div>

      </div>
    </div>
    <div class="price-info">
      <div class="container">
        <h2>商品介绍</h2>

        <!-- 接口没提供属性名称，那就不显示吧
           <div class="attributes">
          <ul class="attributes-list">
            <li
              v-for="(item, index) in product.productAttributeValueList"
              :key="index"
            >
              {{ item.attrName }}:&nbsp;{{ item.value }}
            </li>
          </ul>
        </div> -->
        <div class="desc" v-html="product.detailHtml">
          <!-- <img src="/imgs/detail/item-price.jpeg" alt=""> -->
        </div>
      </div>
    </div>
    <service-bar></service-bar>
  </div>
</template>
<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import ProductParam from "./../components/ProductParam";
import ServiceBar from "./../components/ServiceBar";
import "swiper/dist/css/swiper.css";
export default {
  name: "detail",
  data() {
    return {
      id: this.$route.params.id, //获取商品ID
      flashPromotionId: this.$route.params.flashPromotionId,
      flashRelationId: this.$route.params.flashRelationId,
      err: "",
      version: 1, //商品版本切换
      product: null, //商品信息
      stock: 0,
      swiperOption: {
        autoplay: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      },
      skuId: 0,
      albumPics: [],
      clicked: null,
      serviceIds: [],
      skuPrice:0,
      skuName:'',
      verifyCodeInfoUrl:"",
      verifyCode:''
    };
  },
  components: {
    swiper,
    swiperSlide,
    ProductParam,
    ServiceBar,
  },
  mounted() {
    this.getCacheStock();
    this.getProductInfo();
    this.getVerifyCodeInfo();
  },
  methods: {
    getProductInfo() {
      this.axios.get(`/pms/productInfo/${this.id}`).then((res) => {
        this.product = res;

        this.albumPics =res.albumPics? res.albumPics.split(","):[];
        this.albumPics.unshift(res.pic);
        if (
          this.albumPics == null ||
          this.albumPics == undefined ||
          this.albumPics == ""
        ) {
          this.albumPics = res.pic.split(",");
        }

        this.serviceIds = res.serviceIds.split(",");
      });
    },
    getCacheStock(){
       this.axios.get('/cache/stock?productId='+this.id+'&flashRelationId='+this.flashRelationId).then(
          res => {if(res!=null){
            this.stock= res}}
       )
    },
    secKill(){
      //开始验证-验证码
      let vefifyCodeUrl="/skCart/checkCode"+"?verifyCode="+this.verifyCode;
      this.axios.post(vefifyCodeUrl).then((res)=>{
        localStorage.setItem("flashPromotionId",this.flashPromotionId) ;
         this.$router.push({path:"/secKillOrderConfirm/"+this.id+"/"+res});
      });

    },

    getVerifyCodeInfo(){
      var timenow = new Date().getTime();
      this.verifyCodeInfoUrl = "/skCart/verifyCode?d="+timenow;
         // this.axios.get("/skCart/verifyCode?productId="+this.id).then((res)=>{
         //  this.verifyCodeInfoUrl = res;
         // });
    },
    refreshCode(){
        this.getVerifyCodeInfo();
    },
    handlerSkuid(item, index) {
      if((item.stock-item.lockStock)<=0){
        this.$message.warning("库存不足，请选择其他规格");
        return;
      }
      // 重复点击则失效
      if (this.clicked == index) {
        this.clicked = null;
        this.skuId = 0;
        this.albumPics = this.product.albumPics.split(",");
        this.albumPics.unshift(this.product.pic);
        this.skuName='';
        this.skuPrice=0;
      } else {
        this.clicked = index;
        this.skuId = item.id;
        if(item.pic) this.albumPics = [item.pic];
        this.skuName=this.product.name+ item.sp1+item.sp2;
        this.skuPrice=this.product.flashPromotionPrice;
      }
    },
  },
};
</script>
<style lang="scss">
@import "./../assets/scss/config.scss";
@import "./../assets/scss/mixin.scss";
.detail {
  .stock {
    margin-top: 15px;
    color: #ff6700;
  }
  .wrapper {
    .swiper {
      float: left;
      width: 642px;
      height: 617px;
      margin-top: 5px;
      .swiper-container{
        height: 617px;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    .content {
      float: right;
      width: 575px;
      height: auto;
      .item-title {
        font-size: 28px;
        padding-top: 30px;
        padding-bottom: 16px;
        height: 66px;
      }
      .item-info {
        font-size: 14px;
        height: 36px;
      }
      .delivery {
        font-size: 16px;
        color: #ff6700;
        margin-top: 26px;
        margin-bottom: 14px;
        height: 15px;
      }
      .item-price {
        font-size: 20px;
        color: #ff6700;
        height: 19px;
        .del {
          font-size: 16px;
          color: #999999;
          margin-left: 10px;
          text-decoration: line-through;
        }
      }
      .btn-group {
        width: 100%;
        height: 54px;
      }
      .after-sale-info {
        margin: 20px 0px;
        a {
          display: inline-block;
          margin-right: 55px;
          line-height: 30px;
          margin-bottom: 10px;
          cursor: default;
          white-space: nowrap;
          color: #b0b0b0;
        }
        i {
          font-size: 24px;
          display: inline-block;
          font-style: normal;
          vertical-align: middle;
        }
        em {
          font-style: normal;
          display: inline-block;
          margin-left: 2px;
          vertical-align: middle;
          font-size: 16px;
        }
      }
      .line {
        height: 0;
        margin-top: 25px;
        margin-bottom: 28px;
        border-top: 1px solid #e5e5e5;
      }
      .item-addr {
        height: 108px;
        background-color: #fafafa;
        border: 1px solid #e5e5e5;
        box-sizing: border-box;
        padding-top: 31px;
        padding-left: 64px;
        font-size: 14px;
        line-height: 14px;
        position: relative;
        .icon-loc {
          position: absolute;
          top: 27px;
          left: 34px;
          @include bgImg(20px, 20px, "/imgs/detail/icon-loc.png");
        }
        .addr {
          color: #666666;
        }
        .stock {
          margin-top: 15px;
          color: #ff6700;
        }
      }
      .item-version,
      .item-color {
        margin-top: 30px;
        h2 {
          font-size: 18px;
          margin-bottom: 20px;
        }
      }
      .item-version,
      .item-color {
        .phone {
          width: 50%;
          height: 50px;
          line-height: 50px;
          font-size: 16px;
          color: #333333;
          border: 1px solid #e5e5e5;
          box-sizing: border-box;
          text-align: center;
          cursor: pointer;
          span {
            color: #666666;
            margin-left: 15px;
          }
          .color {
            display: inline-block;
            width: 14px;
            height: 14px;
            background-color: #666666;
          }
          &.checked {
            border: 1px solid #ff6600;
            color: #ff6600;
          }
        }
        .disabled{
          color: #b0b0b0;
          cursor: auto;}
      }
      .item-total {
        height: 108px;
        background: #fafafa;
        padding: 24px 33px 29px 30px;
        font-size: 14px;
        margin-top: 50px;
        margin-bottom: 30px;
        box-sizing: border-box;
        .phone-total {
          font-size: 24px;
          color: #ff6600;
          margin-top: 18px;
        }
      }
    }
  }
  .price-info {
    text-align: center;
    background-color: #f3f3f3;
    height: auto;
    h2 {
      font-size: 24px;
      color: #333333;
      padding-top: 38px;
      margin-bottom: 30px;
      border-bottom: coral 2px solid;
      line-height: 50px;
    }
    .attributes-list {
      width: 749px;
      display: block;
      clear: both;
      margin: 20px auto;
      min-height: 50px;
      text-align: left;
      li {
        display: inline;
        float: left;
        width: 206px;
        height: 24px;
        margin-right: 20px;
        overflow: hidden;
        text-indent: 5px;
        line-height: 24px;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>