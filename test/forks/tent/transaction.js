/* global describe, it */

const assert = require('assert')

const {
  networks,
  Transaction
} = require('../../../src')

const fixtures = require('../../fixtures/forks/tent/transaction')

describe('Transaction (tent)', function () {
  describe('fromBuffer/fromHex', function () {
    fixtures.valid.forEach(function (testData) {
      it('imports ' + testData.description, function () {
        const tx = Transaction.fromHex(testData.hex, networks.tentTest)
        assert.equal(tx.version, testData.version)
        assert.equal(tx.versionGroupId, parseInt(testData.versionGroupId, 16))
        assert.equal(tx.overwintered, testData.overwintered)
        assert.equal(tx.locktime, testData.locktime)
        assert.equal(tx.expiryHeight, testData.expiryHeight)
        assert.equal(tx.ins.length, testData.insLength)
        assert.equal(tx.outs.length, testData.outsLength)
        assert.equal(tx.joinsplits.length, testData.joinsplitsLength)
        assert.equal(tx.joinsplitPubkey.length, testData.joinsplitPubkeyLength)
        assert.equal(tx.joinsplitSig.length, testData.joinsplitSigLength)

        if (testData.valueBalance) {
          assert.equal(tx.valueBalance, testData.valueBalance)
        }
        if (testData.nShieldedSpend > 0) {
          for (var i = 0; i < testData.nShieldedSpend; ++i) {
            assert.equal(tx.vShieldedSpend[i].cv.toString('hex'), testData.vShieldedSpend[i].cv)
            assert.equal(tx.vShieldedSpend[i].anchor.toString('hex'), testData.vShieldedSpend[i].anchor)
            assert.equal(tx.vShieldedSpend[i].nullifier.toString('hex'), testData.vShieldedSpend[i].nullifier)
            assert.equal(tx.vShieldedSpend[i].rk.toString('hex'), testData.vShieldedSpend[i].rk)
            assert.equal(tx.vShieldedSpend[i].zkproof.sA.toString('hex') +
              tx.vShieldedSpend[i].zkproof.sB.toString('hex') +
              tx.vShieldedSpend[i].zkproof.sC.toString('hex'), testData.vShieldedSpend[i].zkproof)
            assert.equal(tx.vShieldedSpend[i].spendAuthSig.toString('hex'), testData.vShieldedSpend[i].spendAuthSig)
          }
        }
      })
    })

    fixtures.valid.forEach(function (testData) {
      it('exports ' + testData.description, function () {
        const tx = Transaction.fromHex(testData.hex, networks.tentTest)
        const hexTx = tx.toHex()
        assert.equal(testData.hex, hexTx)
      })
    })

    fixtures.valid.forEach(function (testData) {
      it('clone ' + testData.description, function () {
        const tx = Transaction.fromHex(testData.hex, networks.tentTest)
        const clonedTx = tx.clone()
        assert.equal(clonedTx.toHex(), testData.hex)
      })
    })
  })

  describe('hashForTentSignature', function () {
    fixtures.hashForTentSignature.valid.forEach(function (testData) {
      it('should return ' + testData.hash + ' for ' + testData.description, function () {
        var network = networks.tent
        network.consensusBranchId[testData.version] = parseInt(testData.branchId, 16)
        var tx = Transaction.fromHex(testData.txHex, network)
        var script = Buffer.from(testData.script, 'hex')
        var hash = Buffer.from(testData.hash, 'hex')
        hash.reverse()
        hash = hash.toString('hex')

        assert.strictEqual(
          tx.hashForTentSignature(testData.inIndex, script, testData.value, testData.type).toString('hex'),
          hash)
      })
    })

    fixtures.hashForTentSignature.invalid.forEach(function (testData) {
      it('should throw on ' + testData.description, function () {
        var tx = Transaction.fromHex(testData.txHex, networks.tentTest)
        var script = Buffer.from(testData.script, 'hex')

        assert.throws(function () {
          tx.hashForTentSignature(testData.inIndex, script, testData.value, testData.type)
        }, new RegExp(testData.exception))
      })
    })
  })
})
