const slotmodel = require("../Models/slots");

const getitems = async (req, res) => {
    try {
        const data = await slotmodel.find({})
        console.log(data);

        res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        res.status(408)
            .json({ message: "Server error" + error, success: false })
    }

}
const setitems = (req, res) => {
    console.log("set items");

}

module.exports = {
    getitems,
    setitems
}