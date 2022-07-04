class SplitMiddleWare {
  orderSplit = async (req, res, next) => {
    const {SplitInfo} = req.body;
    const splitTypeBucket = [[], [], []];
    let totalRatio = 0;

    for (let i = 0; i < SplitInfo.length; i++) {
      if (SplitInfo[i].SplitType === "FLAT") {
        splitTypeBucket[0].push(SplitInfo[i]);
      } else if (SplitInfo[i].SplitType === "PERCENTAGE") {
        splitTypeBucket[1].push(SplitInfo[i]);
      } else {
        splitTypeBucket[2].push(SplitInfo[i]);
        totalRatio += SplitInfo[i].SplitValue;
      }
    }

    req.splitTypeBucket = splitTypeBucket;
    req.totalRatio = totalRatio;
    res.SplitBreakdown = [];
    return next();
  };

  splitFlat = async (req, res, next) => {
    let flatInfo = req.splitTypeBucket[0];

    for (let i = 0; i < flatInfo.length; i++) {
      const {SplitType, SplitValue, SplitEntityId} = flatInfo[i];

      res.SplitBreakdown.push({
        SplitEntityId,
        Amount: SplitValue,
      });
      req.body.Amount -= SplitValue;
    }

    return next();
  };

  splitPercentage = async (req, res, next) => {
    let percentInfo = req.splitTypeBucket[1];

    for (let i = 0; i < percentInfo.length; i++) {
      const {SplitType, SplitValue, SplitEntityId} = percentInfo[i];
      const Amount = (SplitValue / 100) * req.body.Amount;
      res.SplitBreakdown.push({
        SplitEntityId,
        Amount,
      });
      req.body.Amount -= Amount;
    }

    return next();
  };

  splitRatio = async (req, res, next) => {
    let ratioInfo = req.splitTypeBucket[2];
    let total = 0;
    for (let i = 0; i < ratioInfo.length; i++) {
      const {SplitType, SplitValue, SplitEntityId} = ratioInfo[i];
      const Amount = (SplitValue / req.totalRatio) * req.body.Amount;
      res.SplitBreakdown.push({
        SplitEntityId,
        Amount,
      });
      total += Amount;
    }
    res.ID = req.body.ID;
    res.Balance = req.body.Amount - total;
    return next();
  };
}

module.exports = new SplitMiddleWare();
