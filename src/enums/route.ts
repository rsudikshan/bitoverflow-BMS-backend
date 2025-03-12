export enum ApiRoutes{
    MAIN = '/api/',

    AUTH = MAIN+'auth/',

    REGISTER = AUTH+'register',
    LOGIN = AUTH+'login',

    ADMIN_REGISTER = AUTH+'admin/register',

    PROTECTED = MAIN+'protected/',

    PROTECTED_BLOG = PROTECTED+'blog/',
    CREATE_BLOG = PROTECTED_BLOG+'createBlog',
    UPDATE_BLOG = PROTECTED_BLOG+'updateBlog',
    DELETE_BLOG = PROTECTED_BLOG+'deleteBlog',
    GET_PERSONAL_BLOG_WITH_ID = PROTECTED_BLOG+'getAll', //personal blogs

    ADMIN_DELETE = PROTECTED+'adminDelete',

    BLOG = MAIN+'blog/',
    GET_BLOGS = BLOG + 'getAll'

}