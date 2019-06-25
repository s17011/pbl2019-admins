// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from "firebase/app";
import "firebase/firestore";
require('dotenv').config();

Vue.config.productionTip = false

firebase.initializeApp({
  databaseURL: process.env.DATABASE_URL,
  projectId: `${process.env.PROJECT_ID}`,
});

const db = firebase.firestore();
export default db;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
