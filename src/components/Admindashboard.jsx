'use client'

import { useEffect, useState } from 'react'
import { auth } from '../lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './AdminDashboard.module.css'


export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/Login')
      } else {
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [router])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/Login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>Loading...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div>
          <h2 className={styles.sidebarTitle}>
            Admin Dashboard
          </h2>
          <nav className={styles.sidebarNav}>
          <Link href="/admin/submitted-forms" className={styles.sidebarLink}>
              Submitted Forms
            </Link>
          <Link href="/admin/manage-users" className={styles.sidebarLink}>
              Update Users
            </Link>
            <Link href="/admin/manage-events" className={styles.sidebarLink}>
              Update Events
            </Link>
            <Link href="/admin/manage-workshops" className={styles.sidebarLink}>
              Update Workshop
            </Link>
            <Link href="/admin/manage-internships" className={styles.sidebarLink}>
              Update Internship
            </Link>
            <Link href="/admin/manage-courses" className={styles.sidebarLink}>
              Update Courses
            </Link>
            <Link href="/admin/manage-careers" className={styles.sidebarLink}>
              Update Careers
            </Link>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className={styles.logoutButton}
        >
          Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        <h1 className={styles.mainTitle}>Learning Destiny Admin Dashboard</h1>
        <p className={styles.mainDescription}>
          Choose an option from the sidebar to update content on the website.
        </p>

        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Manage Users</h2>
            <p className={styles.cardDescription}>Manage user profiles, reset passwords, and deactivate accounts</p>
            <Link href="/admin/manage-users" className={styles.cardButton}>
              Go to Users
            </Link>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Manage Events</h2>
            <p className={styles.cardDescription}>Update and organize upcoming events.</p>
            <Link href="/admin/manage-events" className={styles.cardButton}>
              Manage Events
            </Link>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Manage Workshops</h2>
            <p className={styles.cardDescription}>Add or edit workshop details.</p>
            <Link href="/admin/manage-workshops" className={styles.cardButton}>
              Go to Workshops
            </Link>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Manage Internships</h2>
            <p className={styles.cardDescription}>Control internship postings and information.</p>
            <Link href="/admin/manage-internships" className={styles.cardButton}>
              Go to Internships
            </Link>

          </div>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Manage Courses</h2>
            <p className={styles.cardDescription}>Add or edit courses details.</p>
            <Link href="/admin/manage-courses" className={styles.cardButton}>
              Go to Courses
            </Link>
          </div>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Manage Careers</h2>
            <p className={styles.cardDescription}>Add or edit career details.</p>
            <Link href="/admin/manage-careers" className={styles.cardButton}>
              Go to Careers
            </Link>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Submitted Forms <span className='bg-orange-400 text-xs font-normal rounded-full px-2 py-1 text-white '>New * </span></h2>
            <p className={styles.cardDescription}>View all the submitted forms.</p>
            <Link href="/admin/submitted-forms" className={styles.cardButton}>
            Go to Submitted Forms
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}