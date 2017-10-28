const BaseService = require('./BaseService');
const rp = require('request-promise');

class IndexService extends BaseService {
    async hotServiceItemsData() {
        const options = {
            method: 'GET',
            json: true,
            qs: {
                count: '3'
            },
            uri: `${this.url}/first/hotServiceItems`
        };
        try {
            const response = await rp(options);
            return response;

        } catch (error) {
            throw new Error(error);
        }
    }

    async requirementData() {
        const options = {
            method: 'GET',
            json: true,
            qs: {
                count: '3'
            },
            uri: `${this.url}/first/requirement`
        };
        try {
            const response = await rp(options);
            return response;

        } catch (error) {
            throw new Error(error);
        }
    }

    async expertData() {
        const options = {
            method: 'GET',
            json: true,
            qs: {
                count: '3'
            },
            uri: `${this.url}/first/expert`
        };
        try {
            const response = await rp(options);
            return response;

        } catch (error) {
            throw new Error(error);
        }
    }

    async contentData() {
        const options = {
            method: 'GET',
            json: true,
            qs: {
                count: '3'
            },
            uri: `${this.url}/first/content`
        };
        try {
            const response = await rp(options);
            return response;

        } catch (error) {
            throw new Error(error);
        }
    }

    async carouselData(){
        const options = {
            method: 'GET',
            json: true,
            qs: {
                count: '3'
            },
            uri: `${this.url}/first/swiper`
        };
        try {
            const response = await rp(options);
            return response;

        } catch (error) {
            throw new Error(error);
        }
    }

    async serviceorg(){
        const options = {
            method: 'GET',
            json: true,
            qs: {
                count: '3'
            },
            uri: `${this.url}/serviceorg/recommend`
        };
        try {
            const response = await rp(options);
            return response;

        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = IndexService;