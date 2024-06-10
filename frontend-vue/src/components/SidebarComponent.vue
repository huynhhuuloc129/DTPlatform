<template>
    <aside class="sidebar">
      <div class="menu toggle" :style="{ 'color': 'black' }">
        <svg style="background: none;" data-toggle="collapse" data-target="#main-navbar"
          xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor"
          class="bi bi-list burger js-menu-toggle header" viewBox="0 0 16 16">
          <path fill-rule="evenodd"
            d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
        </svg>
      </div>
      <div class="side-inner">
  
        <div class="profile">
            <div class="h6">
                <span class="h6">Độ dài: </span>
                <span>150km</span>
            </div>
            <div class="h6">
                <span class="h6">Lượng khí thải: </span>
                <span>1000 PPM</span>
            </div>
            <div class="h6">
                <span class="h6">Thời gian: </span>
                <span>20 phút</span>
            </div>
        </div>
        <hr>
        <!-- <div class="counter d-flex justify-content-center">
          <div class="col">
            <strong class="number">{{ totalPost }}</strong>
            <span class="number-label">Bài viết</span>
          </div>
          <div class="col">
            <strong class="number">{{ currentUser.totalFollower }}</strong>
            <span class="number-label">Theo dõi</span>
          </div>
          <div class="col">
            <strong class="number">{{ currentUser.totalFollowee }}</strong>
            <span class="number-label">Đang theo dõi</span>
          </div>
        </div> -->
  
        <div class="nav-menu">
          <ul>
            <li><a href="http://localhost:5173"><span><i class="icon fas fa-home"></i></span>Bảng tin</a></li>

            <li><a :href="'http://localhost:5173/personal/' "><span><i
                    class="icon fa-regular fa-compass"></i></span>Sản phẩm</a></li>

            <li><a href="http://localhost:5173/admin"><span><i
                    class="icon fa-solid fa-chart-simple"></i></span>Thống kê</a></li>

            <li data-bs-toggle="modal" data-bs-target="#feedbackModal"><a href="#"><span><i
                    class="icon fa-solid fa-comment"></i></span>Phản hồi</a>
            </li>
  
            <li><a href="#"><span><i class="icon fa-solid fa-right-from-bracket"></i></span>Đăng xuất</a>
            </li>
          </ul>
        </div>
      </div>
  
    </aside>
  
    <div class="modal fade" id="feedbackModal" tabindex="-1" aria-labelledby="feedbackModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="feedbackModalLabel">Ý kiến phản hồi</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form>
              <label for="feedback">Tiêu đề:</label>
              <input type="text" class="form-control" id="feedback" required>
  
              <label for="feedback" style="margin-top: 20px;">Phản hồi cho admin:</label>
              <textarea type="text" class="form-control" id="message" required></textarea>
              <div class="d-flex justify-content-end">
                <button type="submit" style="margin: 5px;" class="btn btn-primary">Gửi</button>
                <button type="button" style="margin: 5px;" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import $ from "jquery";
  import { ref } from 'vue'
  import { useCookies } from "vue3-cookies";
  
  const cookies = useCookies();
  const tokenBearer = cookies.cookies.get('Token')
  
  $(function () {
    'use strict';
    // @ts-ignore
    $('.js-menu-toggle').click((e) => {
  
      var $this = $(this);
  
      if ($('body').hasClass('show-sidebar')) {
        $('body').removeClass('show-sidebar');
        $this.removeClass('active');
      } else {
        $('body').addClass('show-sidebar');
        $this.addClass('active');
      }
  
      e.preventDefault();
      $(document).mouseup(function (e) {
        var container = $(".sidebar");
        // @ts-ignore
        if (!container.is(e.target) && container.has(e.target).length === 0) {
          if ($('body').hasClass('show-sidebar')) {
            $('body').removeClass('show-sidebar');
            $('body').find('.js-menu-toggle').removeClass('active');
          }
        }
      });
    });
  
  });
  </script>
  
  <style>
  .sidebar {
    z-index: 9999999;
  }
  
  .header:hover {
    color: rgb(184, 182, 182);
  }
  
  .icon {
    margin-right: 10px;
  }
  
  a {
    -webkit-transition: .3s all ease;
    -o-transition: .3s all ease;
    transition: .3s all ease;
  }
  
  
  body {
    position: relative;
  }
  
  body:before {
  
  }
  
  body.show-sidebar:before {
    opacity: 1;
    visibility: visible;
  }
  
  .site-section {
    padding: 7rem 0;
  }
  
  aside {
    height: 100vh;
    min-height: 580px;
    top: 0;
    width: 300px;
    left: 0;
    z-index: 1001;
    position: fixed;
    -webkit-transform: translateX(-100%);
    -ms-transform: translateX(-100%);
    transform: translateX(-100%);
    background-color: #fff;
    -webkit-transition: 1s -webkit-transform cubic-bezier(0.23, 1, 0.32, 1);
    transition: 1s -webkit-transform cubic-bezier(0.23, 1, 0.32, 1);
    -o-transition: 1s transform cubic-bezier(0.23, 1, 0.32, 1);
    transition: 1s transform cubic-bezier(0.23, 1, 0.32, 1);
    transition: 1s transform cubic-bezier(0.23, 1, 0.32, 1), 1s -webkit-transform cubic-bezier(0.23, 1, 0.32, 1);
  }
  
  .show-sidebar aside {
    -webkit-transform: translateX(0%);
    -ms-transform: translateX(0%);
    transform: translateX(0%);
  }
  
  aside .toggle {
    padding-left: 25px;
    padding-top: 20px;
    position: absolute;
    right: 0;
    -webkit-transform: translateX(100%);
  }
  
  .show-sidebar aside .toggle .burger:before,
  .show-sidebar aside .toggle .burger span,
  .show-sidebar aside .toggle .burger:after {
    background: #fff;
  }
  
  .show-sidebar aside {
    -webkit-box-shadow: 10px 0 30px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 10px 0 30px 0 rgba(0, 0, 0, 0.1);
  }
  
  aside .side-inner {
    padding: 30px 0;
    height: 100vh;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
  
  aside .side-inner .profile {
    margin-left: 40px;
    margin-right: auto;
  }
  
  aside .side-inner .profile img {
    width: 80px;
    margin: 0 auto 20px auto;
    border-radius: 50%;
  }
  
  aside .side-inner .profile .name {
    font-size: 18px;
    margin-bottom: 0;
  }
  
  aside .side-inner .profile .country {
    font-size: 14px;
    color: #cfcfcf;
  }
  
  aside .side-inner .counter {
    margin-bottom: 30px;
    padding-bottom: 30px;
    border-bottom: 1px solid #efefef;
    text-align: center;
  }
  
  aside .side-inner .counter div .number {
    display: block;
    font-size: 20px;
    color: #000;
  }
  
  aside .side-inner .counter div .number-label {
    color: #cfcfcf;
  }
  
  aside .side-inner .nav-menu ul,
  aside .side-inner .nav-menu ul li {
    padding: 0;
    margin: 0px;
    list-style: none;
  }
  
  aside .side-inner .nav-menu ul li a {
    display: block;
    padding-left: 30px;
    padding-right: 30px;
    padding-top: 10px;
    padding-bottom: 10px;
    color: #8b8b8b;
    position: relative;
    -webkit-transition: .3s padding-left ease;
    -o-transition: .3s padding-left ease;
    transition: .3s padding-left ease;
  }
  
  aside .side-inner .nav-menu ul li a:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 0px;
    background-color: blue;
    opacity: 0;
    visibility: hidden;
    -webkit-transition: .3s opacity ease, .3s visibility ease, .3s width ease;
    -o-transition: .3s opacity ease, .3s visibility ease, .3s width ease;
    transition: .3s opacity ease, .3s visibility ease, .3s width ease;
  }
  
  aside .side-inner .nav-menu ul li a:active,
  aside .side-inner .nav-menu ul li a:focus,
  aside .side-inner .nav-menu ul li a:hover {
    outline: none;
  }
  
  aside .side-inner .nav-menu ul li a:hover {
    background: #fcfcfc;
    color: #000;
  }
  
  aside .side-inner .nav-menu ul li a:hover:before {
    width: 4px;
    opacity: 1;
    visibility: visible;
  }
  
  aside .side-inner .nav-menu ul li.active a {
    background: #fcfcfc;
    color: #000;
  }
  
  aside .side-inner .nav-menu ul li.active a:before {
    opacity: 1;
    visibility: visible;
    width: 4px;
  }
  
  .burger {
    width: 20px;
    height: 20px;
    cursor: pointer;
    position: relative;
    z-index: 99;
    float: left;
  }
  
  .burger:before,
  .burger span,
  .burger:after {
    width: 100%;
    height: 2px;
    display: block;
    background: #000;
    border-radius: 2px;
    position: absolute;
    opacity: 1;
  }
  
  .burger:before,
  .burger:after {
    -webkit-transition: top 0.35s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.35s cubic-bezier(0.23, 1, 0.32, 1), background-color 1.15s cubic-bezier(0.86, 0, 0.07, 1), -webkit-transform 0.35s cubic-bezier(0.23, 1, 0.32, 1);
    transition: top 0.35s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.35s cubic-bezier(0.23, 1, 0.32, 1), background-color 1.15s cubic-bezier(0.86, 0, 0.07, 1), -webkit-transform 0.35s cubic-bezier(0.23, 1, 0.32, 1);
    -o-transition: top 0.35s cubic-bezier(0.23, 1, 0.32, 1), transform 0.35s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.35s cubic-bezier(0.23, 1, 0.32, 1), background-color 1.15s cubic-bezier(0.86, 0, 0.07, 1);
    transition: top 0.35s cubic-bezier(0.23, 1, 0.32, 1), transform 0.35s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.35s cubic-bezier(0.23, 1, 0.32, 1), background-color 1.15s cubic-bezier(0.86, 0, 0.07, 1);
    transition: top 0.35s cubic-bezier(0.23, 1, 0.32, 1), transform 0.35s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.35s cubic-bezier(0.23, 1, 0.32, 1), background-color 1.15s cubic-bezier(0.86, 0, 0.07, 1), -webkit-transform 0.35s cubic-bezier(0.23, 1, 0.32, 1);
    -webkit-transition: top 0.35s cubic-bezier(0.23, 1, 0.32, 1), -webkit-transform 0.35s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.35s cubic-bezier(0.23, 1, 0.32, 1), background-color 1.15s cubic-bezier(0.86, 0, 0.07, 1);
    content: "";
  }
  
  .burger:before {
    top: 4px;
  }
  
  .burger span {
    top: 15px;
  }
  
  .burger:after {
    top: 26px;
  }
  
  /* Hover */
  .burger:hover:before {
    top: 7px;
  }
  
  .burger:hover:after {
    top: 23px;
  }
  
  /* Click */
  .burger.active span {
    opacity: 0;
  }
  
  .burger.active:before,
  .burger.active:after {
    top: 40%;
  }
  
  .burger:focus {
    outline: none;
  }
  
  .menu {
    background: none;
  }
  </style>