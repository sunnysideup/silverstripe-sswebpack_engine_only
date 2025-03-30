#!/bin/bash

DIR="../../vendor/firesphere/cspheaders/"
COMMAND="../../vendor/bin/sake dev/tasks/Firesphere-CSPHeaders-Tasks-SRIRefreshTask"

if [ -d "$DIR" ]; then
  $COMMAND
fi
