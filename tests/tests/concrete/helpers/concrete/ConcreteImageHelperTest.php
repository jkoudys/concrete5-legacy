<?php

/**
 * Generated by PHPUnit_SkeletonGenerator 1.2.0 on 2013-03-11 at 17:48:28.
 */
class ConcreteImageHelperTest extends PHPUnit_Framework_TestCase {

    /**
     * @var ConcreteImageHelper
     */
    protected $object;

    /**
     * Sets up the fixture, for example, opens a network connection.
     * This method is called before a test is executed.
     */
    protected function setUp() {
		 $this->object = Loader::helper('concrete/image');
    }

    /**
     * Tears down the fixture, for example, closes a network connection.
     * This method is called after a test is executed.
     */
    protected function tearDown() {
        
    }
	 public function testObjectClass() {
		 $this->assertTrue($this->object instanceof ConcreteImageHelper);
	 }

    /**
     * @covers ConcreteImageHelper::determineImageScale
     * @todo   Implement testDetermineImageScale().
     */
    public function testDetermineImageScale() {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
                'This test has not been implemented yet.'
        );
    }

    /**
     * @covers ConcreteImageHelper::startImageProcess
     * @todo   Implement testStartImageProcess().
     */
    public function testStartImageProcess() {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
                'This test has not been implemented yet.'
        );
    }

    /**
     * @covers ConcreteImageHelper::parseImage
     * @todo   Implement testParseImage().
     */
    public function testParseImage() {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
                'This test has not been implemented yet.'
        );
    }

    /**
     * @covers ConcreteImageHelper::setTransparency
     * @todo   Implement testSetTransparency().
     */
    public function testSetTransparency() {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
                'This test has not been implemented yet.'
        );
    }

}
