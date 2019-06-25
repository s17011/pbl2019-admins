<template>
  <div id="app">
    <div id="admin-page">
      <div class="admin-page-container">
        <h1 class="hidden">管理画面</h1>
        <div class="task-view">
          <div class="task-view-container">
            <div class="task-list">
              <div
                v-for="(image, i) in images"
                :key="i"
                @click="selectImage(i)"
                :data-selected="i == selectedIndex"
              >
                <figure v-show="displayAll || (!image.submitted || !image.resolved)">
                  <img :src="image.downloadURL" alt="" />
                </figure>
              </div>
            </div>

            <div class="task-details">
              <div class="task-details-header">
                <div class="resolution-checkbox">
                  <label @click="restoreCondition">
                    解決済み
                    <input
                      type="checkbox"
                      v-model="images[selectedIndex].resolved"
                    />
                  </label>
                  <label>
                    全表示
                    <input
                      type="checkbox"
                      v-model="displayAll"
                    />
                  </label>
                  <label @click="updateCondition">
                    更新
                  </label>
                </div>
              </div>
              <div class="task">
                <div class="task-image">
                  <figure>
                    <img style="height:200px;" :src="images[selectedIndex].downloadURL" alt="" />
                  </figure>
                </div>
                <div class="task-text">
                  <div class="title">
                    <p><b>問題の詳細</b></p>
                  </div>
                  <div class="content">
                    <p>{{ images[selectedIndex].incidentDetail }}</p>
                  </div>
                </div>
              </div>
              <div class="location">
                <div class="map">
                  <iframe style="height:100%; width:100%;" :src="iframeURL"></iframe>
                </div>
                <div class="location-text">
                  <div class="title">
                    <p><b>場所の詳細</b></p>
                  </div>
                  <div class="content">
                    <p>{{ images[selectedIndex].locationDetail }}</p>
                  </div>
                </div>
              </div>
              <div class="comments hidden">
                <div class="title">
                  <p><b>コメント</b></p>
                </div>
                <ul>
                  <li><p>複数の死者が出ています</p></li>
                  <li><p>先行部隊が全滅しました</p></li>
                </ul>

                <div class="input-field">
                  <form>
                    <textarea></textarea>
                    <button>投稿</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import db from "./main";
const p = console.log;

export default {
  name: 'App',
  data() {
    return {
      images: [],
      selectedIndex: 0,
      displayAll: false,
      iframeURL: "https://maps.google.co.jp/maps?output=embed&q=インド",
    };
  },
  created: function() {
    db.collection("images")
      .orderBy('timestamp', 'desc')
      .get()
      .then(doc => {
        doc.docs.forEach(x =>
          this.images.push(
            Object.assign({ resolved: false, submitted: false }, x.data())
          )
        );
      });
    p(this.images);
  },
  computed: {
    isVisible: function(i) {
      if (this.displayAll) {
        return true;
      } else if (this.images[i].submitted && !this.images[i].resolved) {
        return false;
      }
      return true;
    },
  },
  methods: {
    selectImage: function(i) {
      this.selectedIndex = i;
      this.setIframeURL(i);
    },
    setIframeURL: function(i) {
      this.iframeURL = `https://maps.google.co.jp/maps?output=embed&q=${this.images[i].latitude},${this.images[i].longitude}`
    },
    restoreCondition: function() {
      this.images[this.selectedIndex].submitted = false;
    },
    updateCondition: function() {
      db.collection("images")
        .doc(`${this.images[this.selectedIndex].timestamp}`)
        .set({ resolved: this.images[this.selectedIndex].resolved }, {merge: true});
      this.images[this.selectedIndex].submitted = true;
      p("update condition");
    },
  }
}
</script>

<style>
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */

@charset 'utf-8';

#admin-page p {
  padding: 0;
  margin: 0;
}

#admin-page .task-view-container {
  display: flex;
  margin: 0 auto;
  min-width: 600px;
  padding: 10px;
  background-color: #eee;
}

#admin-page .task-list,
#admin-page .task-details {
  padding: 10px;
}

#admin-page .task-list {
  overflow-y: scroll;
  height: 600px;
  margin-right: 10px;
}

#admin-page .task-list {
  flex: 0 0 200px;
  background-color: #999;
  color: white;
}

#admin-page .task-list figure {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px;
}

#admin-page .task-list img {
  box-sizing: border-box;
  max-width: 100%;
}

#admin-page .task-details {
  flex: 1 1 auto;
  background-color: #fff;
}

#admin-page .task,
#admin-page .location {
  display: flex;
  margin-bottom: 10px;
  border-bottom: 1px solid #aaa;
}

#admin-page .task-image,
#admin-page .task-text,
#admin-page .map,
#admin-page .location-text,
#admin-page .comments {
  padding: 10px;
}

#admin-page .task-image,
#admin-page .task-text {
  flex: 1 1;
  padding: 10px;
}

#admin-page .title {
  margin: 10px 0;
}

#admin-page .content {
  padding: 10px;
}

#admin-page .task-image {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 400px;
  min-width: 300px;
}

#admin-page .task-image figure {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 5px;
}

#admin-page .task-image img {
  max-width: 100%;
}

#admin-page .map,
#admin-page .location-text {
  flex: 1 1;
}

#admin-page .map {
  height: 300px;
  max-width: 400px;
  min-width: 300px;
}

/* comment input field */

#admin-page .input-field form {
  display: flex;
}

#admin-page .input-field button {
  width: 80px;
  height: 30px;
  margin-top: auto;
}

#admin-page .input-field textarea {
  padding: 10px;
  width: 300px;
  height: 100px;
}

/* 解決ボタン */
#admin-page .resolution-checkbox label {
  display: inline-block;
  color: #555;
  padding: 10px;
  border: 3px solid #999;
  border-radius: 10px;
  box-sizing: border-box;
}

#admin-page .resolution-checkbox label:hover {
  background-color: rgba(200, 200, 200, 0.1);
}

.hidden {
  display: none;
}

/* 768px以下 */
@media only screen and (max-width: 768px) {
  #admin-page .task,
  #admin-page .location {
    flex-flow: column;
  }

  #admin-page .map {
    flex: 0 0 300px;
  }
}
</style>
