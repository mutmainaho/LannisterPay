

function splitPayment(req, res, next){
    const {ID, Balance, SplitBreakdown} = res
    return res.status(200).json({
        ID, Balance, SplitBreakdown
    })
}


module.exports = splitPayment