

https://www.carlhopf.com/blog/2016/09/11/nodejs-cpu-profiling-production/
perf script | stackcollapse-perf.pl | flamegraph.pl --color=js --hash  > node.svg
stackvis perf flamegraph-svg < out.nodestacks > collapsed.svg
./FlameGraph/stackcollapse-perf.pl < out.nodestacks
https://github.com/thlorenz/flamegraph


for dir in ./node-*; do (cd "$dir" && node --perf_basic_prof server.js  > /dev/null &); done

offcpu bcc/eBPF
sudo python offcpu -f -p 7932 > offcpu.stack

offcpu perf
echo 1 | sudo tee /proc/sys/kernel/sched_schedstats
sudo perf record --event sched:sched_stat_sleep --event sched:sched_process_exit --event sched:sched_switch -g --output perf.data.raw -p ${PID}     //-call-graph=dwarf
sudo perf inject -v -s -i perf.data.raw -o perf.data

perf script -F comm,pid,tid,cpu,time,period,event,ip,sym,dso,trace | awk '
    NF > 4 { exec = $1; period_ms = int($5 / 1000000) }
    NF > 1 && NF <= 4 && period_ms > 0 { print $2 } NF < 2 && period_ms > 0 { printf "%s\n%d\n\n", exec, period_ms }' > offcpu.stack

cat offcpu.stack | stackcollapse.pl | flamegraph.pl --colors=js > offcpu.svg


perf elevate rights by Milian Wolff (shell-helpers/blob/master/elevate_perf_rights.sh)
sudo mount -o remount,mode=755 /sys/kernel/debug
sudo mount -o remount,mode=755 /sys/kernel/debug/tracing
echo "-1" | sudo tee /proc/sys/kernel/perf_event_paranoid

https://poormansprofiler.org/

netutils/irqs
https://github.com/strizhechenko/netutils-linux


pv /dev/zero > /dev/null
tinkerboard
[2.54GiB/s]

tegra tk1
[5.17GiB/s]

mac pro i7
[16.0GiB/s]

 Pentium CPU G3460 @ 3.50GHz
[16.8GiB/s]

iperf -s
iperf -c 127.0.0.1

network mac -> pentium

tegra tk1
0.0-10.0 sec  11.4 GBytes  9.82 Gbits/sec
Pentium
0.0-10.0 sec  43.0 GBytes  36.9 Gbits/sec
mac pro
0.0-10.0 sec  48.2 GBytes  41.4 Gbits/sec

mac->tegra:  26.5 Mbits/sec



perf bench futex hash
     pentium 3576627 ops/sec || 3582566 ops/sec
perf stat -e cycles sleep 1
     pentium  916 075      cycles