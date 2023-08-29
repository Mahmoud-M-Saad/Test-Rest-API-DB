exports.getPosts = (req, res) => {
    res
        .status(200)
        .json({
            posts: [
                {
                    title: 'First Post',
                    content: 'Let\'s see all the new!'
                }
            ]
        });
};

exports.createPost = (req, res) => {
    const title = req.body.title;
    const content = req.body.content;

    res
        .status(201) //200: Successfully & 201: Successfully Added
        .json({
            message: 'Post Created Successfully',
            post: {
                id: new Date().toISOString(),
                title: title,
                content: content
            }
        });
}