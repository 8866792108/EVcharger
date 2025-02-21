const slotmodel = require("../Models/slots");
const fs = require("fs")

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
const setitems = async (req, res) => {
    console.log("set items", req.file);
    console.log("Body::", req.body.address);

    try {
        const { name, address, latitude, longitude } = req.body
        const { filename } = req.file

        const isaddress = await slotmodel.findOne({ address })
        console.log(isaddress);

        if (isaddress) {
            return res.json({ message: "Already slot axist", success: false })
        }

        //new slot creating
        const newslot = new slotmodel({
            name: name,
            address: address,
            image: filename,
            latitude: latitude,
            longitude: longitude
        })
        console.log("New User :: ", newslot)

        await newslot.save()

        return res.status(200).json({ message: "SuccessFully Added", success: true })

    } catch (error) {
        res.status(201)
            .json({ message: "Server Error" + error, success: false })
    }


}


const findById = async (req, res) => {
    try {
        const { id } = req.params;

        const slot = await slotmodel.findById(id)

        if (!slot) {
            return res.status(404).json({ message: "Slot Not Found" });
        }

        res.status(200).json(slot);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


const removeitems = async (req, res) => {
    try {
        console.log("the data is :: " + req.params);
        const { slotid } = req.params
        const slot = await slotmodel.findById(slotid);
        console.log("the find id is :: " + slot);
        fs.unlink(`public/images/${slot.image}`, () => { })

        await slotmodel.findByIdAndDelete(slotid);
        res.status(200)
            .json({ success: true, message: "slot removed successfully" })
    } catch (error) {
        console.log(error);
        res.status(201)
            .json({ success: false, message: "Some Thing Went Wrong" })
    }
}

module.exports = {
    getitems,
    setitems,
    removeitems,
    findById
}