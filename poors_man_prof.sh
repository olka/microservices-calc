#!/bin/bash
#taken from https://poormansprofiler.org/
nsamples=7
sleeptime=0
pid=$1

for x in $(seq 1 $nsamples)
  do
      gdb -ex "set pagination 0" -ex "thread apply all bt" -batch -p $pid
          sleep $sleeptime
            done | \
            awk '
              BEGIN { s = ""; } 
                /^Thread/ { print s; s = ""; } 
                  /^\#/ { if (s != "" ) { s = s "," $4} else { s = $4 } } 
                    END { print s }' | \
                    sort | uniq -c | sort -r -n -k 1,1