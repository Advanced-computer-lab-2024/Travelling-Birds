const Address = require('../Models/Address');
const User = require('../Models/User');

// create new address
const addAddress = async (req, res) => {
    try {
        const { country,city, street, postalCode,type , floorNumber, apartmentNumber, isDefault } = req.body;
        const userId = req.params.id;
        if (isDefault) {
            // Update all other addresses of this user to not be default
            await Address.updateMany(
                { userId: userId, isDefault: true },
                { $set: { isDefault: false } }
            );
        }
        const newAddress = new Address({
            street,
            city,
            type,
            postalCode,
            country,
            apartmentNumber,
            floorNumber,
            isDefault
        });
        await newAddress.save();
        await User.findByIdAndUpdate(
            userId,
            { $push: { address: newAddress._id } },
            { new: true }
        );
        return res.status(201).json({
            message: 'Address added successfully',
            address: newAddress
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
//get all user address
const getUserAddresses = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const addressIds = user.address;

        if (!addressIds || addressIds.length === 0) {
            return res.status(404).json({ message: 'No addresses found for this user' });
        }
        const addresses = await Address.find({ _id: { $in: addressIds } });

        if (addresses.length === 0) {
            return res.status(404).json({ message: 'No addresses found' });
        }
        return res.status(200).json({ addresses });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
// Backend deleteAddress function
const deleteAddress = async (req, res) => {
    try {
        const userId = req.params.id;
        const { addressId } = req.body;
        const address = await Address.findByIdAndDelete(addressId);
        if (!address) {
            return res.status(404).json({ message: 'No addresses found' });
        }
        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { address: addressId } },
            { new: true }
        );
        return res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

//update address
const updateAddress = async (req, res) => {
    try{
        const userId = req.params.id;
        const { addressId, country, city, street, postalCode, type, floorNumber, apartmentNumber, isDefault } = req.body;
        // If the address is being updated to default, update all other addresses to not be default
        if (isDefault) {
            await Address.updateMany(
                { userId: userId, isDefault: true },
                { $set: { isDefault: false } }
            );
        }
        const updatedAddress = await Address.findByIdAndUpdate(
            addressId ,
            { country, city, street, postalCode, type, floorNumber, apartmentNumber, isDefault },
            { new: true }
        );
        if (!updatedAddress) {
            return res.status(404).json({ message: 'Address not found' });
        }
        return res.status(200).json({ message: 'Address updated successfully', address: updatedAddress });
    }catch(error){
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}
const updateCurrentAddress = async (req, res) => {
    try{
        const userId = req.params.id;
        const addressId = req.body;

        const updateCurrentAddress = await User.findOneAndUpdate(
            {userId},
            {currentAddress:addressId},
            {new:true}
        );
        if (!updateCurrentAddress) {
            return res.status(404).json({ message: 'Address not found' });
        }
        return res.status(200).json({ message: 'Address updated successfully', address: updatedAddress });
    }catch(error){
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    addAddress,
    deleteAddress,
    updateAddress,
    getUserAddresses,
    updateCurrentAddress
};
