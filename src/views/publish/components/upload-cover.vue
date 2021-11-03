<template>
  <div class="upload-cover" @click="showCoverSelect">
    <div class="cover-wrap" :class="{wrap:thewrap}">
      <img
        class="cover-image"
        ref="cover-image"
        :src="value"
      >
    </div>
<!-- :visible.sync="dialogVisible" -->
<div v-if="dialogVisible">
      <el-dialog
      title="选择封面"
      v-model="dialogVisible"
      append-to-body
    >
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="first">
          <!--
            ref 有两个作用
            1、作用到普通 HTML 标签上可以获取 DOM
            2、作用到组件上可以获取组件
           -->
           <!-- 组件复用 可以在复用的组件传递单独的值 is-show-add是在复用的组件中props中定义的值 -->
          <image-list
            :is-show-add="false"
            :is-show-action="false"
            is-show-selected
            :foo="666"
            ref="image-list"
          />
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <input
            type="file"
            ref="file"
            @change="onFileChange"
          >
          <img
            width="100"
            ref="preview-image"
          >
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="onCoverConfirm"
        >确 定</el-button>
      </span>
    </el-dialog>
</div>
  </div>
</template>

<script>
import { uploadImage } from '@/api/image'
import ImageList from '@/views/image/components/image-list'

export default {
  name: 'UploadCover',
  components: {
    ImageList
  },
  props: ['value'],
  // props: ['cover-image'],
  data () {
    return {
      dialogVisible: false,
      activeName: 'second',
      thewrap:true
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    showCoverSelect () {
      // 展示选择封面的弹窗
      this.dialogVisible = true
    },

    onFileChange () {
      // 获取文件对象
      // console.log(this.$refs.file)
      const file = this.$refs['file'].files[0]

      // 图片预览
      const blob = window.URL.createObjectURL(file)
      this.$refs['preview-image'].src = blob

      // 防止用户选择同一个文件不触发 change 事件 在这里不需要判断
      // this.$refs.file.value = ''
    },

    onCoverConfirm () {
      // this.$refs['cover-wrap'].background.url=null
      this.thewrap=false
      // 如果 tab 是上传图片，并且 input-file 有选择的文件，才执行上传图片的操作
      if (this.activeName === 'second') {
        const file = this.$refs.file.files[0]
        if (!file) {
          this.$message('请选择文件')
          return
        }
        // 执行上传文件的操作
        const fd = new FormData()
        // FormData是一个对象，对象的键是根据接口需要的名字确定的
        fd.append('image', file)
        uploadImage(fd).then(res => {
          // 关闭弹出层
          this.dialogVisible = false
          // 展示上传的图片
          this.$refs['cover-image'].src = res.data.data.url

          // 将图片地址发送给父组件
          this.$emit('input', res.data.data.url)
          // this.$emit('update-cover', res.data.data.url) 已经通过v-model进行重写
        })
      } else if (this.activeName === 'first') {
        // 还有一种组件通信方式：父组件可以直接访问子组件中的数据 $ref
        const imageList = this.$refs['image-list']
        const selected = imageList.selected
        if (selected === null) {
          this.$message('请选择封面图片')
          return
        }
        // 关闭对话框
        this.dialogVisible = false
        // 修改父组件绑定数据
        this.$emit('input', imageList.images[selected].url)
      }
    }
  }
}
</script>

<style scoped lang="less">
.cover-wrap {
  width: 150px;
  height: 120px;
  border: 1px solid rgb(161, 159, 159);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  background-size:cover;
  .cover-image {
    height: 120px;
    max-width: 100%;
  }
}
.wrap{
  background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAADImlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4zLWMwMTEgNjYuMTQ1NjYxLCAyMDEyLzAyLzA2LTE0OjU2OjI3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1MzUxNDdBMzNCNTcxMUU5QkNDMTlDQ0M5MThDQkJBMCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1MzUxNDdBNDNCNTcxMUU5QkNDMTlDQ0M5MThDQkJBMCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjUzNTE0N0ExM0I1NzExRTlCQ0MxOUNDQzkxOENCQkEwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjUzNTE0N0EyM0I1NzExRTlCQ0MxOUNDQzkxOENCQkEwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+cuiUFwAACBVJREFUeF7t3VdvFMsChdH2IYOECA8gEALxxP//P/BAeCDnHM5lj1xXI+MDtvGMe9trSaOJzv6murpr7I1/f5qASv9sngOFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFBAzFNv79afMy/NaPHz82L/185v/Hc/8cCJgd+fbt2/TgwYPpw4cP09mzZ6cbN25Mx48f37yXg+JplB1LxF+/fl2cMw8ChmICZscy7z127Jj574z4SUAxAUMxAUMxAbMjmfvGOOo4rnOwHAdeg3yLlxdBzEE+p42NjcUOqZxHDg+N25fleg4fPXr0aPr48eN05syZ6fr169OJEyf+H/Sy8T4cJ149Aa/Yly9fprdv306fP3+evn//vnnrwcsTSgK8cuXKYjRNvAk0n+/WvcyJMb8my8d/E+e4fau879x/69atX54M2F8CXqGMWs+ePZs+ffq0+KWe0yg8Ar558+Yi4Hyud+/eXXyu220ejxE1cedtx2i9nTxRnTx5crpz545DTism4BVKvBl98y1OFGNzdQ7f8hGwEbibgFck39YEkU3n/DJfunRpsYZ4LvL5Ja7xpBJjVN0aXa6bA8+TgFcko1AW/+cX/9SpU9O1a9e23TRtkV+Te/fuTe/fv5/OnTs33b59+5fQWT8TFCgm4BVaHqHaR6uxB318HXPao36UCXhNzFRYBQFDMQFDMQFDMQEXGCufcsrlg5IdV+PEPAh45nLc9fHjx4tjyvfv319czm0HIcezT58+vThnHizkWJGMlA8fPlwsTdzrQo6XL19OL168WLyPZVlnnJVdFy9e3LxlPZZXalllNQ9G4JnKKPv8+fPFiwsSTJY8jmWPuS33rXskTrRZPine+RDwDGWUe/PmzWIZ5tZROwHnttyXx+zHBlS2Fsbc9r/m2Pk4uT+jcM5tuM2DgGcoEWWUjQSb07JxfbxMca8SYf5Qe0bzzK1zyuW8YGFroPk4Yy6e87/5uOwfAUMxAR9R2TGW0fbp06fTu3fvFqN5Tnn9cl7H/Pr1619G4Wy25+WROWceBDxD2VmVwzWx3Vxz3JbHbH3x/U5ks3n8sYFxTHd5J1nifvXq1WKOvSz3Z/69l4/JavhJzFAiOn/+/GKP79YdRrmc23JfHrN1fvwnGW1zaCrz3BjRDrmcSDPHTcCJfdy+bLsnFtZPwDOVF83nWG9G2cSSoHLK5dx2+fLlxWN2Y8Q7/mzO7+LPfWNP93Z+97asj4BnLAFfvXp1unDhwiLanHI5t+12EUc2l7MwJIeBEt+fAhz3Z16c48154rDpPD9+Imuy103OjLL5w3P5f7w55fJuR94EmDntTkbeZXlsRv3luTLzIuA1+ZtNzoSU1U857XYUzFw3I282h/c6guZtMxfOk9DffB3sPwEfYjnkkzlvzhPeXuIbo3ACzigs4HkR8CGVuW5G3sSbCP8mvIy82fw2As+PgA+hjJiJN6PmXkdeOgj4EMoqqvFKJfEebgKGYgI+ZLJYI4d9shm9173O9PATPkSywyrHe8diDQ4/AR+wjJT7sUhi7HXO3mI7ro4OAR+gLLJ48uTJ4gXyWXOcmPcih3cy8trrfPQI+IAktvF3rRJyFlzkJX4ZQXcrc157nY8mAR+AzFWXF1mMl+9lB1QizvlO107nxQY5bJTNcDutjh4/8TVLaNutkBqXE2RG5mwS/2mTesx7s1bZyHs0CXhNRmCZ6ybSXN8aXa4n5ESegDM/zmO3G40Tdx6Tze/t3hdHg4DXYASW+W02jxPf74Ibm8KZJ+dvViXUvO0YkXOezea8L/EebQJegwSWzdxEt9PN3RHmeLuMxpkfZ2dXos5I7sUFCHjFElhGzAS3283dPC6jcULNCJw9zXk/GZn/NIpzNAgYigl4xTJKZqdURs+9jppjJI6xQ8voSwh4TcYOqL+RaMcJQsBrIjpWQcBQTMArtNPlkLBXAl6RbDJnjfNh3HTO18U8CHhFEm7+k0Lsxw6sORh70fN1jb3iHKyNn5t5tvNWJKuosnoq65mj+Vs9tiTG/2U6efLk4joHS8ArlhVU4wUMzSNxRtzEm/+IKN75EPCa5Nvc/K3OCHwY5/PtBAzF7ImAYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGYgKGWtP0P/dQ6E8kIIvkAAAAAElFTkSuQmCC') no-repeat center;
}
</style>
