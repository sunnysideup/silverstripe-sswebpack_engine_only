<?php

class SswebpackEngineOnlyTest extends SapphireTest
{
    protected $usesDatabase = false;

    protected $requiredExtensions = array();

    public function TestDevBuild()
    {
        $exitStatus = shell_exec('vendor/bin/sake dev/build flush=all  > dev/null; echo $?');
        $exitStatus = intval(trim($exitStatus));
        $this->assertEquals(0, $exitStatus);
    }
}
