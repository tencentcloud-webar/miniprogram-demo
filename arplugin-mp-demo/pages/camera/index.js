// index.js
import { APP_ID, LICENSE_KEY, authFunc } from '../../utils/auth';

Page({
	data: {
		appId: APP_ID,
		licenseKey: LICENSE_KEY,
		authFunc,
		beautifyEnable: false,
		filterEnable: false,
		makeupEnable: false,
		stickerEnable: false,
		effectState: [],
		isRecord: false,
	},
	async takePhoto() {
		// tempFilePath 仅插件版本大于1.0.14支持
		const { uint8ArrayData, width, height, tempFilePath } = await this.sdk.takePhoto();
		wx.previewImage({ urls: [tempFilePath] });
		// 保存至相册
		wx.saveImageToPhotosAlbum({
			filePath: tempFilePath,
		});
	},
	startRecord() {
		this.setData({ isRecord: true });
		this.sdk.startRecord().then(() => {
			console.log('start success');
		});
	},
	async stopRecord() {
		this.setData({ isRecord: false });
		// useOriginAudio 为 false 时不录制音频
		const result = await this.sdk.stopRecord({ useOriginAudio: true });
		const { tempFilePath } = result;

		wx.saveVideoToPhotosAlbum({
			filePath: tempFilePath,
			success: (_) => {
				console.log('save success');
			},
			fail: (error) => {
				console.log(error);
			},
		});
	},
	onArCreated(event) {
		this.sdk = event.detail;
	},
	toggleBeautify: function () {
		this.setData({
			beautifyEnable: !this.data.beautifyEnable,
		});
		if (this.data.beautifyEnable) {
			this.sdk.setBeautify({
				whiten: 0.3,
				dermabrasion: 0.7,
				eye: 1,
			});
		} else {
			this.sdk.setBeautify({
				whiten: 0,
				dermabrasion: 0,
				eye: 0,
			});
		}
	},
	toggleFilter: function () {
		this.setData({
			filterEnable: !this.data.filterEnable,
		});
		if (this.data.filterEnable) {
			this.sdk.setFilter('5505217E53997405', 1);
		} else {
			this.sdk.setFilter('5505217E53997405', 0);
		}
	},
	toggleMakeup: function () {
		this.setData({
			makeupEnable: !this.data.makeupEnable,
		});
		if (this.data.makeupEnable) {
			this.data.effectState.push({
				// 美妆
				id: '9C7E317E53997405',
				intensity: 1,
			});
		} else {
			this.data.effectState = this.data.effectState.filter((item) => {
				return item.id !== '9C7E317E53997405';
			});
		}
		this.sdk.setEffect(this.data.effectState, 1);
	},
	toggleSticker: function () {
		this.setData({
			stickerEnable: !this.data.stickerEnable,
		});
		if (this.data.stickerEnable) {
			this.data.effectState.push({
				id: 'BF3C417FD91CACC0' /* 悟空特效 */,
				intensity: 1,
			});
		} else {
			this.data.effectState = this.data.effectState.filter((item) => {
				return item.id !== 'BF3C417FD91CACC0' /* 悟空特效 */;
			});
		}
		this.sdk.setEffect(this.data.effectState, 1);
	},
});
