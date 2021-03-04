const URLS = {
    home: '/:base_url/',

    app_index: '/:base_url/:app_label/',

    model_list: '/:base_url/:app_label/:model_name/',
    model_add: '/:base_url/:app_label/:model_name/add/',
    model_edit: '/:base_url/:app_label/:model_name/:id(\\d+)/edit/',
};


export default URLS;