
function paginationHelper(pageNum, pageSize) {
    if (!pageNum)
        pageNum = 1;
    if (!pageSize)
        pageSize = 10;

    let skip = (pageNum - 1) * pageSize;
    return {skip , limit:pageSize};

}

module.exports=paginationHelper;