const OrganizationRepository = require("../repository/organization.repository")

getOrganizationInformation = async (req, res) => {
    const organizationExist = await OrganizationRepository.hasOrganizationExist(req.params.id);
    if (!organizationExist) {
        res.status(400).send({message: "organization does not exist!"})
        return;
    }

    const organization = await OrganizationRepository.getOrganization(req.params.id);
    res.status(200).send({
        id: organization._id,
        name: organization.name,
        description: organization.description
    });
}

const InformationServices = {
    getOrganizationInformation,
}

module.exports = InformationServices;