/**
 * @class RecommendationTemplate
 * @description Represents a recommendation template entity within the recommendation system
 */
export class RecommendationTemplate {
    /**
     * Creates a new RecommendationTemplate instance
     * @param {Object} params - The template initialization parameters
     * @param {number} [params.id=0] - Unique identifier for the template
     * @param {string} [params.title=''] - Title of the recommendation template
     * @param {string} [params.content=''] - Content/description of the template
     */
    constructor({
                    id = 0,
                    title = '',
                    content = ''
                } = {}) {
        /**
         * @type {number}
         * @description Unique identifier for the template
         */
        this.id = id;

        /**
         * @type {string}
         * @description Title of the recommendation template
         */
        this.title = title;

        /**
         * @type {string}
         * @description Content/description of the template
         */
        this.content = content;
    }
}

/**
 * @class CreateRecommendationTemplateRequest
 * @description DTO for creating a new recommendation template
 */
export class CreateRecommendationTemplateRequest {
    /**
     * @param {Object} params
     * @param {string} [params.title=''] - Title of the template
     * @param {string} [params.content=''] - Content of the template
     */
    constructor({
                    title = '',
                    content = ''
                } = {}) {
        this.title = title;
        this.content = content;
    }
}