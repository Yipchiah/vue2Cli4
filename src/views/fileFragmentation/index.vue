<template>
  <div>
    <input ref="fileInput" type="file" @change="handleFileChange" />
  </div>
</template>

<script>
import SparkMD5 from 'spark-md5'
const SIZE = 1 * 1024 * 1024 // 切片大小 1m
// import { request } from '@/utils/request'
export default {
  name: 'FileFragmentation',
  components: {},
  data () {
    return {
      file: '',
      fileChunkList: [], // 文件切片数组
      hash: '', // 保证文件唯一性
      container: {
        file: ''
      },
      percentage: 0,
      chunks: null, // 切块数
      listData: [] // 提交给后台的切片数组
    }
  },
  methods: {
    // 创建文件切片数组
    createFileChunk (file, chunkSize) {
      this.chunks = Math.ceil(file.size / chunkSize)
      // return chunks
      const fileChunkList = []
      let cur = 0
      while (cur < file.size) {
        // 继承了blob的slice方法
        fileChunkList.push({ file: file.slice(cur, cur + chunkSize) })
        cur += chunkSize
      }
      return fileChunkList
    },
    handleFileChange (e) {
      // 获取blob对象
      const [file] = e.target.files
      if (!file) return
      this.file = file
      // input上传文件名相同的文件，不会再次触发change事件，清空value值即可
      this.$refs.fileInput.value = null
      this.uploadFile()
    },
    // 官方demo获取hash 文件读取是异步的？？？
    demoCreateHash (file) {
      return new Promise(resolve => {
        const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
        const spark = new SparkMD5.ArrayBuffer()
        const reader = new FileReader()
        let currentChunk = 0
        reader.onload = e => {
          console.log('read chunk nr', currentChunk + 1, 'of', this.chunks)
          spark.append(e.target.result) // Append array buffer
          currentChunk++
          if (currentChunk < this.chunks) {
            loadNext()
          } else {
            console.log('finished loading')
            console.info('computed hash', spark.end())// Compute hash
            resolve(spark.end())
          }
        }
        reader.onerror = function () {
          console.warn('oops, something went wrong.')
        }
        const loadNext = () => {
          const start = currentChunk * SIZE
          const end = ((start + SIZE) >= file.size) ? file.size : start + SIZE
          reader.readAsArrayBuffer(blobSlice.call(file, start, end))
        }
        loadNext()
      })
    },
    // 获取文件唯一hash值 copy by https://juejin.im/post/5e367f6951882520ea398ef6
    createHash (fileChunkList) {
      const spark = new SparkMD5.ArrayBuffer() // 创建SparkMD5实例
      let percentage = 0
      let count = 0
      const loadNext = index => {
        const reader = new FileReader()
        // readAsArrayBuffer 对图片很方便
        reader.readAsArrayBuffer(fileChunkList[index].file)
        reader.onload = e => {
          count++
          spark.append(e.target.result)
          if (count === fileChunkList.length) {
            const md5 = spark.end()
            this.hash = md5
            console.log('this.hash', this.hash)
          } else {
            percentage += 100 / fileChunkList.length
            console.log('percentage222222', percentage)
            // 递归计算下一个切片
            loadNext(count)
          }
        }
      }
      loadNext(0)
    },
    // 生成文件 hash（web-worker）
    calculateHash (fileChunkList) {
      return new Promise(resolve => {
      // 添加 worker 属性
        this.container.worker = new Worker('/hash.js')
        this.container.worker.postMessage({ fileChunkList })
        this.container.worker.onmessage = e => {
          const { percentage, hash } = e.data
          this.hashPercentage = percentage
          if (hash) {
            resolve(hash)
          }
        }
      })
    },
    async handleUpload () {
      if (!this.container.file) return
      const fileChunkList = this.createFileChunk(this.container.file, SIZE)
      this.container.hash = await this.calculateHash(fileChunkList)
      this.data = fileChunkList.map(({ file }, index) => ({
        fileHash: this.container.hash,
        chunk: file,
        hash: this.container.file.name + '-' + index, // 文件名 + 数组下标
        percentage: 0
      }))
      await this.uploadChunks()
    },
    uploadChunks () {},
    // 掉接口上传文件
    async uploadFile () {
      if (!this.file) return
      const file = this.file
      const fileChunkList = this.createFileChunk(file, SIZE)
      this.hash = await this.demoCreateHash(file)
      this.listData = fileChunkList.map(({ file }, index) => ({
        fileHash: this.hash,
        chunk: file,
        hash: `${this.file.name}-${index}`
      }))
      console.log('this.listData', this.listData)
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
