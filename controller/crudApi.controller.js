const CRUD = require('../model/crudApi.model')
const nodemailer = require('nodemailer')
class crudApiController {
  /**
   * @Method showMessage
   * @Description to show a message
   */

  async showMessage(req, res) {
    try {
      return res.status(200).json({
        message: 'Welcome to Crud Api',
      })
    } catch (err) {
      throw err
    }
  }

  /**
   * @Method create
   * @Description To add data
   */

  async create(req, res) {
    try {
      req.body.firstName = req.body.firstName.trim()
      req.body.lastName = req.body.lastName.trim()
      req.body.email = req.body.email.trim()
      if (!req.body.firstName || !req.body.lastName || !req.body.email) {
        return res.status(400).json({
          message: 'Field should not be empty!!',
        })
      } else {
        let isEmailExists = await CRUD.findOne({
          email: req.body.email,
        })
        if (!isEmailExists) {
          let saveData = await CRUD.create(req.body)
          if (saveData && saveData._id) {
            return res.status(200).json({
              message: 'Data Added Successfully!!',
              data: saveData,
            })
          } else {
            return res.status(400).json({
              message: 'Data Not Added Successfully!!',
              data: [],
            })
          }
        } else {
          return res.status(400).json({
            message: 'Email Already Exists',
            data: [],
          })
        }
      }
    } catch (err) {
      throw err
    }
  }

  /**
   * @Method fetchData
   * @ Description Fetch all data
   */

  async fetchData(req, res) {
    try {
      let allData = await CRUD.find({})
      return res.status(200).json({
        message: 'Data Fetched Successfully ',
        data: allData,
      })
    } catch (err) {
      throw err
    }
  }

  /**
   * @Method update
   * @Description To Update a data from DB
   */

  async update(req, res) {
    try {
      req.body.firstName = req.body.firstName.trim()
      req.body.lastName = req.body.lastName.trim()
      req.body.email = req.body.email.trim()
      if (!req.body.firstName || !req.body.lastName || !req.body.email) {
        return res.status(400).json({
          message: 'Field should not be empty!!',
        })
      } else {
        let isUserExists = await CRUD.findOne({
          _id: req.params.id,
        })
        if (isUserExists) {
          let dataUpdate = await CRUD.findByIdAndUpdate(req.params.id, req.body)
          if (dataUpdate && dataUpdate._id) {
            return res.status(200).json({
              message: 'Data Updated Successfully!!',
              data: dataUpdate,
            })
          } else {
            return res.status(400).json({
              message: 'Data Not Updated Successfully!!',
              data: [],
            })
          }
        } else {
          return res.status(400).json({
            message: 'Data Not Found!!',
            data: [],
          })
        }
      }
    } catch (err) {
      throw err
    }
  }

  /**
   * @Method delete
   * @Description To Delete Data
   */
  async delete(req, res) {
    try {
      let deleteData = await CRUD.findByIdAndRemove(req.params.id)
      if (deleteData) {
        return res.status(200).json({
          message: 'Data Deleted Successfully !!',
        })
      } else {
        return res.status(400).json({
          message: 'Data Not Deleted Successfully!!! ',
        })
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *   @Mathode:  mailSending
   *   @Description: To send a mail
   */

  async mailSending(req, res) {
    let transporter = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: '1934fe1a244c45',
        pass: '727f7397df4eb8',
      },
    })

    let mailOptions = {
      from: 'no-reply@debashiroy.in',
      to: 'debashisroyjgec@gmail.com',
      subject: 'Welcome Mail!',
      text: 'Testing for mail send',
    }
    
    transporter.sendMail(mailOptions, (err) => {
      if (!err) {
        res.status(200).send({
          message: 'Mail Sent Successfully!',
        })
      } else {
        console.log(err)
        res.status(400).send({
          message: 'Mail Not Sent Successfully!',
        })
      }
    })
  }
}

module.exports = new crudApiController()
