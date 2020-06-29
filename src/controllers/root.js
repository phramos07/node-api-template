/**
 * BLiP-iCustomer integration API
 * Authors: Pedro Costa <pedroc@take.net>
 * 
 * Module:
 *      Root Controller
 * 
 * Description:
 *      None.
 * 
 */

// Constants
const PATH = '/root';

/**
 *  @swagger
 * /root:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     tags:
 *     - "health"
 *     summary: "Health check."
 *     description: "Health check."
 *     responses:
 *       200:
 *         description: "All is fine."
 */
const welcomeMessage = async (_, res) => {
    return res.json({ message: "Welcome to BLiP-iCustomer integration API" });
};

module.exports = {
    PATH,
    welcomeMessage
};